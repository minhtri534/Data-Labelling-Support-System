import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { annotatorService } from "../services/annotatorService";
import {
  Bot,
  Trash,
  Pencil,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
  AlertCircle
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
  const { id: taskId } = useParams<{ id: string }>();
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
  const [aiBox, setAiBox] = useState<Box | null>(null);

  // State quản lý URL ảnh an toàn (Blob URL)
  const [secureImageUrl, setSecureImageUrl] = useState<string>("");

  const currentItem = taskItems[current];
  const boxes = annotations[current] || [];

  // 1. Tải dữ liệu Task & Labels
  useEffect(() => {
    const loadTaskData = async () => {
      setLoading(true);
      try {
        let activeId = taskId;
        if (!activeId) {
          const tasksRes = await annotatorService.getMyTasks();
          if (tasksRes.isSuccess && tasksRes.data?.length > 0) {
            activeId = tasksRes.data[0].id;
            window.history.replaceState(null, "", `/annotator/ai-label/${activeId}`);
          } else {
            setLoading(false);
            return;
          }
        }

        const [itemsRes, labelsRes] = await Promise.all([
          annotatorService.getTaskItems(activeId!),
          annotatorService.getLabels(activeId!)
        ]);

        if (itemsRes.isSuccess && itemsRes.data) {
          const fetchedItems = itemsRes.data;
          setTaskItems(fetchedItems);
          const initialAnnotations: Record<number, Box[]> = {};
          
          await Promise.all(fetchedItems.map(async (item: any, index: number) => {
            const annRes = await annotatorService.getAnnotations(item.id);
            if (annRes.isSuccess && annRes.data) {
              initialAnnotations[index] = annRes.data.map((ann: any) => {
                try {
                  return { ...JSON.parse(ann.geometryData), labelId: ann.labelId };
                } catch (e) { return null; }
              }).filter((b: any) => b !== null);
            }
          }));
          setAnnotations(initialAnnotations);
        }
        if (labelsRes.isSuccess) setLabels(labelsRes.data);
      } catch (err) {
        console.error("Load task data failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTaskData();
  }, [taskId]);

  useEffect(() => {
    let objectUrl = "";
    
    const fetchImage = async () => {
      if (!currentItem) return;

      setSecureImageUrl(""); 

      try {
        const blob = await annotatorService.getImageSecure(currentItem.id);
        objectUrl = URL.createObjectURL(blob);
        setSecureImageUrl(objectUrl);
      } catch (error) {
        console.error("Image load failed:", error);
        setSecureImageUrl(FALLBACK_IMAGE);
      }
    };

    fetchImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentItem]);

  const handleRequestAI = () => {
    setAiBox({ x: 100, y: 100, width: 200, height: 150, labelId: labels[0]?.id });
  };

  const acceptAI = () => {
    if (!aiBox) return;
    setAnnotations(prev => ({ 
      ...prev, 
      [current]: [...(prev[current] || []), aiBox] 
    }));
    setAiBox(null);
  };

  const getMousePosition = (e: any) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    };
  };

  const handleMouseDown = (e: any) => {
    if (!drawMode) return;
    setStartPoint(getMousePosition(e));
    setDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!drawing || !startPoint) return;
    const pos = getMousePosition(e);
    setPreviewBox({
      x: Math.min(startPoint.x, pos.x),
      y: Math.min(startPoint.y, pos.y),
      width: Math.abs(pos.x - startPoint.x),
      height: Math.abs(pos.y - startPoint.y)
    });
  };

  const handleMouseUp = () => {
    if (!drawing || !previewBox) return;
    if (previewBox.width > 5 && previewBox.height > 5) {
      setAnnotations(prev => ({ 
        ...prev, 
        [current]: [...(prev[current] || []), { ...previewBox, labelId: labels[0]?.id }] 
      }));
    }
    setDrawing(false);
    setStartPoint(null);
    setPreviewBox(null);
  };

  const processSubmit = async (isDraft: boolean) => {
    if (!currentItem) return;
    setSubmitting(true);
    try {
      const payload = {
        objects: (annotations[current] || []).map(b => ({
          labelId: b.labelId || labels[0]?.id,
          geometryData: JSON.stringify({ 
            x: Math.round(b.x), y: Math.round(b.y), 
            width: Math.round(b.width), height: Math.round(b.height) 
          })
        }))
      };
      const res = isDraft 
        ? await annotatorService.saveDraft(currentItem.id, payload)
        : await annotatorService.submit(currentItem.id, payload);
      
      if (res.isSuccess) {
        if (!isDraft) {
          if (current < taskItems.length - 1) {
            setCurrent(prev => prev + 1);
            setAiBox(null);
          } else {
            navigate("/annotator/returned");
          }
        } else {
          alert("Draft saved successfully!");
        }
      }
    } catch (err) { console.error("Submit error:", err); } 
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Preparing image data...</p>
      </div>
    </DashboardLayout>
  );

  if (taskItems.length === 0) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="w-12 h-12 text-amber-500" />
        <p className="text-gray-500 font-medium text-lg">No tasks assigned to you.</p>
        <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
      </div>
    </DashboardLayout>
  );

  const toolbarBtnClass = "w-10 h-10 p-0 flex items-center justify-center";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Assisted Annotation</h1>
          <div className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
            Image {current + 1} / {taskItems.length}
          </div>
        </div>

        <Card className="p-6">
          <div className="flex gap-6">
            <div className="flex flex-col gap-3">
              <Button variant={drawMode ? "gradient" : "outline"} className={toolbarBtnClass} onClick={() => setDrawMode(!drawMode)} title="Draw Box">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="outline" className={toolbarBtnClass} onClick={handleRequestAI} title="AI Suggestion">
                <Bot className="w-4 h-4 text-purple-600" />
              </Button>
              <hr />
              <Button variant="outline" className={toolbarBtnClass} onClick={() => setZoom(z => Math.min(z + 0.2, 3))} title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" className={toolbarBtnClass} onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" className={toolbarBtnClass} onClick={() => setAnnotations({...annotations, [current]: []})} title="Clear All">
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-center bg-slate-200 rounded-lg p-4 min-h-[550px]">
              <Button variant="ghost" onClick={() => {setCurrent(c => c - 1); setAiBox(null);}} disabled={current === 0}>
                <ChevronLeft />
              </Button>

              <div
                ref={containerRef}
                className={`relative overflow-hidden border-2 border-white shadow-xl bg-black ${drawMode ? "cursor-crosshair" : ""}`}
                style={{ width: "700px", height: "500px" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                {secureImageUrl && (
                  <img
                    src={secureImageUrl}
                    alt="Task Item"
                    className="max-w-none select-none transition-transform duration-200"
                    draggable={false}
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                    }}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                )}
                
                {boxes.map((box, i) => (
                  <div 
                    key={i} 
                    onClick={(e) => { e.stopPropagation(); setAnnotations(prev => ({...prev, [current]: prev[current].filter((_, idx) => idx !== i)})); }}
                    className="absolute border-2 border-green-500 bg-green-500/10 hover:bg-red-500/30 group cursor-pointer"
                    style={{ left: box.x * zoom, top: box.y * zoom, width: box.width * zoom, height: box.height * zoom }}
                  >
                    <span className="absolute -top-6 left-0 bg-green-500 text-white text-[10px] px-1 opacity-0 group-hover:opacity-100 whitespace-nowrap">Click to delete</span>
                  </div>
                ))}

                {previewBox && (
                  <div className="absolute border-2 border-blue-400 border-dashed bg-blue-400/10"
                    style={{ left: previewBox.x * zoom, top: previewBox.y * zoom, width: previewBox.width * zoom, height: previewBox.height * zoom }}
                  />
                )}

                {aiBox && (
                  <div className="absolute border-2 border-purple-500 border-dashed animate-pulse bg-purple-500/10"
                    style={{ left: aiBox.x * zoom, top: aiBox.y * zoom, width: aiBox.width * zoom, height: aiBox.height * zoom }}
                  />
                )}
              </div>

              <Button variant="ghost" onClick={() => {setCurrent(c => c + 1); setAiBox(null);}} disabled={current === taskItems.length - 1}>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </Card>

        {aiBox && (
          <Card className="p-4 flex gap-4 items-center bg-purple-50 border-purple-200 animate-in fade-in slide-in-from-bottom-2">
            <Bot className="w-5 h-5 text-purple-600" />
            <span className="flex-1 text-purple-800 text-sm font-medium">AI detected a potential object. Would you like to use this suggestion?</span>
            <Button variant="outline" onClick={() => setAiBox(null)}>Ignore</Button>
            <Button variant="gradient" onClick={acceptAI}>Accept</Button>
          </Card>
        )}

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">* Tips: Click on a box to remove it. Use the Bot button for AI suggestions.</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => processSubmit(true)} disabled={submitting}><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
            <Button variant="gradient" onClick={() => processSubmit(false)} disabled={submitting || (annotations[current] || []).length === 0}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {current === taskItems.length - 1 ? "Complete & Submit" : "Next Image"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}