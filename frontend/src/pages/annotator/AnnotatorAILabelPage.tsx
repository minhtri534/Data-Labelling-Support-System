import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { annotatorService } from "../../services/annotatorService";
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
  Check,
  X
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
  const [aiBox, setAiBox] = useState<Box | null>(null);
  const [secureImageUrl, setSecureImageUrl] = useState<string>("");

  const currentItem = taskItems[current];
  const boxes = annotations[current] || [];

  useEffect(() => {
    const loadTaskData = async () => {
      setLoading(true);
      try {
        let activeTaskId = taskIdFromUrl;
        if (!activeTaskId || activeTaskId === "undefined") {
          const tasksRes = await annotatorService.getMyTasks();
          if (tasksRes.isSuccess && tasksRes.data?.length > 0) {
            activeTaskId = tasksRes.data[0].id;
            window.history.replaceState(null, "", `/annotator/ai-label/${activeTaskId}`);
          } else { setLoading(false); return; }
        }

        const validTaskId = activeTaskId as string;
        const [itemsRes, labelsRes] = await Promise.all([
          annotatorService.getTaskItems(validTaskId),
          annotatorService.getLabels(validTaskId)
        ]);

        if (itemsRes.isSuccess && itemsRes.data) {
          setTaskItems(itemsRes.data);
          const initialAnnotations: Record<number, Box[]> = {};
          
          await Promise.all(itemsRes.data.map(async (item: any, index: number) => {
            const tid = item.taskId || item.id; 
            if (tid) {
              try {
                const annRes = await annotatorService.getAnnotations(tid);
                if (annRes.isSuccess && annRes.data) {
                  initialAnnotations[index] = annRes.data.map((ann: any) => ({
                    ...JSON.parse(ann.geometryData), 
                    labelId: ann.labelId 
                  }));
                }
              } catch (e) {
                console.error("Error loading annotations for index", index, e);
              }
            }
          }));
          setAnnotations(initialAnnotations);
        }
        if (labelsRes.isSuccess) setLabels(labelsRes.data);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    loadTaskData();
  }, [taskIdFromUrl]);

  useEffect(() => {
    let objectUrl = "";
    const fetchImage = async () => {
      const itemId = currentItem?.dataItemId;
      if (!itemId) return;

      setSecureImageUrl(""); 
      try {
          const blob = await annotatorService.getImageSecure(itemId);
          objectUrl = URL.createObjectURL(blob);
          setSecureImageUrl(objectUrl);
      } catch (error) {
          setSecureImageUrl(FALLBACK_IMAGE);
      }
    };

    fetchImage();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [currentItem]);

  const handleRequestAI = () => {
    if (labels.length > 0) {
      setAiBox({ x: 150, y: 150, width: 200, height: 150, labelId: labels[0].id });
    }
  };

  const acceptAI = () => {
    if (!aiBox) return;
    setAnnotations(prev => ({ ...prev, [current]: [...(prev[current] || []), aiBox] }));
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
      const defaultLabelId = labels.length > 0 ? labels[0].id : "";
      setAnnotations(prev => ({ 
        ...prev, 
        [current]: [...(prev[current] || []), { ...previewBox, labelId: defaultLabelId }] 
      }));
    }
    setDrawing(false); setStartPoint(null); setPreviewBox(null);
  };

  const processSubmit = async (isDraft: boolean) => {
    const taskId = currentItem?.taskId || currentItem?.id;
    if (!taskId) {
        alert("No Task ID found for this item");
        return;
    }

    const currentBoxes = annotations[current] || [];
    if (!isDraft && currentBoxes.length === 0) {
        alert("Please add at least one annotation before submitting.");
        return;
    }

    setSubmitting(true);
    try {
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
      
      const res = isDraft 
        ? await annotatorService.saveDraft(taskId, payload)
        : await annotatorService.submit(taskId, payload);
      
      if (res.isSuccess) {
        if (!isDraft) {
          if (current < taskItems.length - 1) { 
            setCurrent(c => c + 1); 
            setAiBox(null); 
          } else { 
            navigate("/annotator/returned"); 
          }
        } else { 
          alert("Draft saved successfully!"); 
        }
      } else {
        alert(`Error: ${res.message || "Unknown error"}`);
      }
    } catch (err: any) { 
      console.error(err);
      alert(err.response?.data?.message || "Submit failed");
    } finally { 
      setSubmitting(false); 
    }
  };

  if (loading) return <DashboardLayout><div className="flex justify-center mt-20"><Loader2 className="animate-spin" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Assisted Annotation</h1>
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">Image {current + 1} / {taskItems.length}</div>
        </div>

        <Card className="p-6">
          <div className="flex gap-6">
            <div className="flex flex-col gap-3">
              <Button variant={drawMode ? "gradient" : "outline"} className="w-10 h-10 p-0" onClick={() => setDrawMode(!drawMode)} title="Draw Mode"><Pencil className="w-4 h-4" /></Button>
              <Button variant="outline" className="w-10 h-10 p-0" onClick={handleRequestAI} title="AI Suggest"><Bot className="w-4 h-4 text-purple-600" /></Button>
              <hr />
              <Button variant="outline" className="w-10 h-10 p-0" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}><ZoomIn className="w-4 h-4" /></Button>
              <Button variant="outline" className="w-10 h-10 p-0" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}><ZoomOut className="w-4 h-4" /></Button>
              <Button variant="outline" className="w-10 h-10 p-0" onClick={() => setAnnotations({...annotations, [current]: []})}><Trash className="w-4 h-4 text-red-500" /></Button>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-center bg-slate-200 rounded-lg p-4 min-h-[550px]">
              <Button variant="ghost" onClick={() => {setCurrent(c => c - 1); setAiBox(null);}} disabled={current === 0}><ChevronLeft /></Button>

              <div
                ref={containerRef}
                className={`relative overflow-hidden border-2 border-white shadow-xl bg-black ${drawMode ? "cursor-crosshair" : ""}`}
                style={{ width: "700px", height: "500px" }}
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
              >
                {secureImageUrl && (
                  <img src={secureImageUrl} alt="Task" className="max-w-none select-none" draggable={false}
                    style={{ 
                        transform: `scale(${zoom})`, 
                        transformOrigin: "top left",
                        display: "block" 
                    }}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                )}
                
                {boxes.map((box, i) => (
                  <div key={i} className="absolute border-2 border-green-500 bg-green-500/10"
                    style={{ left: box.x * zoom, top: box.y * zoom, width: box.width * zoom, height: box.height * zoom }}
                  />
                ))}

                {aiBox && (
                  <div className="absolute border-2 border-purple-500 border-dashed animate-pulse bg-purple-500/10"
                    style={{ left: aiBox.x * zoom, top: aiBox.y * zoom, width: aiBox.width * zoom, height: aiBox.height * zoom }}
                  >
                    <div className="absolute -top-10 left-0 flex gap-1">
                      <Button size="sm" variant="gradient" className="h-7 px-2" onClick={acceptAI}><Check className="w-3 h-3 mr-1"/> Accept</Button>
                      <Button size="sm" variant="outline" className="h-7 px-2 bg-white" onClick={() => setAiBox(null)}><X className="w-3 h-3 mr-1"/> Reject</Button>
                    </div>
                  </div>
                )}

                {previewBox && (
                  <div className="absolute border-2 border-blue-400 border-dashed bg-blue-400/10"
                    style={{ left: previewBox.x * zoom, top: previewBox.y * zoom, width: previewBox.width * zoom, height: previewBox.height * zoom }}
                  />
                )}
              </div>

              <Button variant="ghost" onClick={() => {setCurrent(c => c + 1); setAiBox(null);}} disabled={current === taskItems.length - 1}><ChevronRight /></Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => processSubmit(true)} disabled={submitting}><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
            <Button variant="gradient" onClick={() => processSubmit(false)} disabled={submitting || (boxes.length === 0 && !aiBox)}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {current === taskItems.length - 1 ? "Complete & Submit" : "Next Image"}
            </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}