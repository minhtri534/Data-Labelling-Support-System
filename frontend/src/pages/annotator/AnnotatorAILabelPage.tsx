import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { annotatorService } from "../../services/annotatorService";
import {
  Trash, Pencil, ZoomIn, ZoomOut,
  ChevronLeft, ChevronRight, Loader2, Save
} from "lucide-react";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
  labelId?: string;
}

const FALLBACK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export default function AnnotatorAILabelPage() {
  const { id: taskIdFromUrl } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [taskItems, setTaskItems] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [annotations, setAnnotations] = useState<Record<number, Box[]>>({});
  const [drawMode, setDrawMode] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [previewBox, setPreviewBox] = useState<Box | null>(null);
  const [secureImageUrl, setSecureImageUrl] = useState<string>("");

  const loadItemAnnotations = useCallback(async (index: number, taskId: string) => {
    if (!taskId || taskId === "undefined") return;
    try {
      const res = await annotatorService.getAnnotations(taskId);
      if (res.isSuccess && res.data) {
        setAnnotations(prev => ({
          ...prev,
          [index]: res.data.map((ann: any) => ({
            ...JSON.parse(ann.geometryData || '{}'),
            labelId: ann.labelId
          }))
        }));
      }
    } catch (err) {
      console.error("Lỗi load annotations:", taskId, err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        let activeId = taskIdFromUrl;
        
        // 1. Lấy Project Task ID từ URL hoặc lấy cái đầu tiên của User
        if (!activeId || activeId === "undefined") {
          const taskRes = await annotatorService.getMyTasks();
          if (taskRes.isSuccess && taskRes.data?.length > 0) {
            activeId = taskRes.data[0].id;
            window.history.replaceState(null, "", `/annotator/ai-label/${activeId}`);
          }
        }

        if (activeId && activeId !== "undefined") {
          // 2. Fetch Items và Labels
          const [itemsRes, labelsRes] = await Promise.all([
            annotatorService.getTaskItems(activeId),
            annotatorService.getLabels(activeId)
          ]);

          if (itemsRes.isSuccess && itemsRes.data) {
            const items = itemsRes.data;
            setTaskItems(items);
            
            const firstAnnotationTaskId = items[0]?.id; 
            
            if (firstAnnotationTaskId) {
              await loadItemAnnotations(0, firstAnnotationTaskId);
            }
          }
          if (labelsRes.isSuccess) setLabels(labelsRes.data);
        }
      } catch (e) {
        console.error("Lỗi khởi tạo:", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [taskIdFromUrl, loadItemAnnotations]);

  // Load ảnh sử dụng dataItemId
  useEffect(() => {
    let url = "";
    const item = taskItems[current];
    const dataItemId = item?.dataItemId;

    if (!dataItemId || dataItemId === "undefined") return;

    const fetchImg = async () => {
      try {
        const blob = await annotatorService.getImageSecure(dataItemId);
        url = URL.createObjectURL(blob);
        setSecureImageUrl(url);
      } catch (err) {
        setSecureImageUrl(FALLBACK_IMAGE);
      }
    };
    fetchImg();
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [current, taskItems]);

  const handlePageChange = async (idx: number) => {
    if (idx < 0 || idx >= taskItems.length) return;
    setCurrent(idx);
    setSecureImageUrl(""); 
    
    const nextItem = taskItems[idx];
    if (nextItem?.id && !annotations[idx]) {
      await loadItemAnnotations(idx, nextItem.id);
    }
  };

  const handleAction = async (isSubmit: boolean) => {
    const item = taskItems[current];
    const taskId = item?.id; // Sử dụng Task ID
    if (!taskId) return;

    setSubmitting(true);
    try {
      const currentBoxes = annotations[current] || [];
      const payload = {
        objects: currentBoxes.map(b => ({
          labelId: b.labelId || labels[0]?.id,
          geometryData: JSON.stringify({
            x: Math.round(b.x),
            y: Math.round(b.y),
            width: Math.round(b.width),
            height: Math.round(b.height)
          })
        }))
      };

      const res = isSubmit 
        ? await annotatorService.submit(taskId, payload)
        : await annotatorService.saveDraft(taskId, payload);

      if (res.isSuccess) {
        if (isSubmit) {
          if (current < taskItems.length - 1) handlePageChange(current + 1);
          else navigate("/annotator/tasks");
        } else {
          alert("Saved draft!");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Logic vẽ (giữ nguyên)
  const handleMouseDown = (e: any) => {
    if (!drawMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setStartPoint({ x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom });
    setDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!drawing || !startPoint || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const curX = (e.clientX - rect.left) / zoom;
    const curY = (e.clientY - rect.top) / zoom;
    setPreviewBox({
      x: Math.min(startPoint.x, curX),
      y: Math.min(startPoint.y, curY),
      width: Math.abs(curX - startPoint.x),
      height: Math.abs(curY - startPoint.y)
    });
  };

  const handleMouseUp = () => {
    if (previewBox && previewBox.width > 5) {
      setAnnotations(prev => ({
        ...prev,
        [current]: [...(prev[current] || []), { ...previewBox, labelId: labels[0]?.id }]
      }));
    }
    setDrawing(false);
    setPreviewBox(null);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-4 pb-10">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Annotation Workspace</h1>
            <p className="text-xs text-slate-400 font-mono">Task ID: {taskItems[current]?.id}</p>
          </div>
          <div className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold">
            {current + 1} / {taskItems.length}
          </div>
        </div>

        <Card className="p-4 flex gap-4 bg-white border-none shadow-lg">
          <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
            <Button variant={drawMode ? "gradient" : "outline"} size="icon" onClick={() => setDrawMode(!drawMode)}><Pencil className="w-5 h-5" /></Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(3, z + 0.2))}><ZoomIn className="w-5 h-5" /></Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}><ZoomOut className="w-5 h-5" /></Button>
            <div className="h-px bg-slate-200 my-1" />
            <Button variant="outline" size="icon" onClick={() => setAnnotations({ ...annotations, [current]: [] })}><Trash className="w-5 h-5 text-red-500" /></Button>
          </div>

          <div className="flex-1 bg-slate-900 rounded-2xl p-4 flex items-center justify-center relative min-h-[500px] shadow-inner">
            <Button variant="ghost" className="text-white hover:bg-white/10 absolute left-2 z-10" onClick={() => handlePageChange(current - 1)} disabled={current === 0}><ChevronLeft className="w-8 h-8" /></Button>
            
            <div 
              ref={containerRef}
              className="relative bg-black overflow-hidden border-2 border-slate-700"
              style={{ width: "700px", height: "500px", cursor: drawMode ? "crosshair" : "default" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {secureImageUrl && (
                <img 
                  src={secureImageUrl} 
                  alt="Current Frame" 
                  draggable={false}
                  className="max-w-none select-none transition-transform duration-100"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
                />
              )}
              {/* Render Boxes */}
              {(annotations[current] || []).map((box, i) => (
                <div 
                  key={i}
                  className="absolute border-2 border-emerald-400 bg-emerald-400/20"
                  style={{ left: box.x * zoom, top: box.y * zoom, width: box.width * zoom, height: box.height * zoom }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnnotations(prev => ({ ...prev, [current]: prev[current].filter((_, idx) => idx !== i) }));
                  }}
                />
              ))}
              {previewBox && (
                <div 
                  className="absolute border-2 border-blue-400 border-dashed bg-blue-400/10"
                  style={{ left: previewBox.x * zoom, top: previewBox.y * zoom, width: previewBox.width * zoom, height: previewBox.height * zoom }}
                />
              )}
            </div>

            <Button variant="ghost" className="text-white hover:bg-white/10 absolute right-2 z-10" onClick={() => handlePageChange(current + 1)} disabled={current === taskItems.length - 1}><ChevronRight className="w-8 h-8" /></Button>
          </div>
        </Card>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" size="lg" onClick={() => handleAction(false)} disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Draft
          </Button>
          <Button variant="gradient" size="lg" onClick={() => handleAction(true)} disabled={submitting}>
             {current === taskItems.length - 1 ? "Submit Task" : "Next Image"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}