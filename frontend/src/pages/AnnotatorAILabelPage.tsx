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
  Loader2
} from "lucide-react";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
  labelId?: string;
}

export default function AnnotatorAILabelPage() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [taskItems, setTaskItems] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [annotations, setAnnotations] = useState<Record<number, Box[]>>({});
  const boxes = annotations[current] || [];

  const [drawMode, setDrawMode] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [previewBox, setPreviewBox] = useState<Box | null>(null);
  const [aiBox, setAiBox] = useState<Box | null>(null);

  useEffect(() => {
    const loadTaskData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [itemsRes, labelsRes] = await Promise.all([
          annotatorService.getTaskItems(id),
          annotatorService.getLabels(id)
        ]);

        if (itemsRes.isSuccess) setTaskItems(itemsRes.data);
        if (labelsRes.isSuccess) setLabels(labelsRes.data);
      } catch (err) {
        console.error("Load task data failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTaskData();
  }, [id]);

  const imageUrl = taskItems[current]
    ? annotatorService.getImageUrl(taskItems[current].taskItemId)
    : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600";

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

  const getMousePosition = (e: any) => {
    const container = containerRef.current!;
    const rect = container.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left + container.scrollLeft) / zoom,
      y: (e.clientY - rect.top + container.scrollTop) / zoom
    };
  };

  const handleMouseDown = (e: any) => {
    if (!drawMode) return;
    e.preventDefault();
    setStartPoint(getMousePosition(e));
    setDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!drawing || !startPoint) return;
    const pos = getMousePosition(e);
    setPreviewBox({
      x: startPoint.x,
      y: startPoint.y,
      width: pos.x - startPoint.x,
      height: pos.y - startPoint.y
    });
  };

  const handleMouseUp = (e: any) => {
    if (!drawing || !startPoint) return;
    const pos = getMousePosition(e);
    let { x, y } = startPoint;
    let w = pos.x - startPoint.x;
    let h = pos.y - startPoint.y;

    if (w < 0) { x += w; w = Math.abs(w); }
    if (h < 0) { y += h; h = Math.abs(h); }

    const newBox: Box = { 
      x, y, width: w, height: h, 
      labelId: labels[0]?.labelId 
    };

    setAnnotations({ ...annotations, [current]: [...boxes, newBox] });
    setDrawing(false);
    setStartPoint(null);
    setPreviewBox(null);
  };

  const clearBoxes = () => setAnnotations({ ...annotations, [current]: [] });

  const handleRequestAI = () => {
    setAiBox({ x: 100, y: 100, width: 200, height: 150, labelId: labels[0]?.labelId });
  };

  const acceptAI = () => {
    if (!aiBox) return;
    setAnnotations({ ...annotations, [current]: [...boxes, aiBox] });
    setAiBox(null);
  };

  const nextImage = () => {
    const max = taskItems.length > 0 ? taskItems.length : 3;
    if (current < max - 1) {
      setCurrent(current + 1);
      setAiBox(null);
    }
  };

  const prevImage = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setAiBox(null);
    }
  };

  const handleSubmit = async () => {
    const taskItem = taskItems[current];

    if (!taskItem || !id) {
      console.log("Demo Mode: Submitting annotations...", boxes);
      alert("Demo: Task submitted successfully!");
      
      if (current < (taskItems.length || 3) - 1) {
        nextImage();
      } else {
        navigate("/annotator/returned");
      }
      return;
    }

    const payload = {
      objects: boxes.map(b => ({
        labelId: b.labelId || labels[0]?.labelId,
        geometryData: { 
          x: b.x,
          y: b.y,
          width: b.width,
          height: b.height
        }
      }))
    };

    try {
      const res = await annotatorService.submit(taskItem.taskItemId, payload);
      
      if (res.isSuccess) {
        alert("Annotation submitted successfully!");
        
        if (current === taskItems.length - 1) {
          navigate("/annotator/returned");
        } else {
          nextImage();
        }
      } else {
        alert(res.message || "Submit failed. Please try again.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error connecting to server. Please check your connection.");
    }
  };

  if (loading && id) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-500">Loading Task Items...</p>
        </div>
      </DashboardLayout>
    );
  }

  const deleteBox = (index: number) => {
    setAnnotations(prev => ({
      ...prev,
      [current]: prev[current].filter((_, i) => i !== index)
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">AI Assisted Annotation</h1>

        <Card className="p-6">
          <div className="flex gap-6">
            <div className="flex flex-col gap-3">
              <Button
                variant={drawMode ? "gradient" : "outline"}
                onClick={() => setDrawMode(!drawMode)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={handleRequestAI}>
                <Bot className="w-4 h-4 text-purple-600" />
              </Button>
              <Button variant="outline" onClick={zoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={zoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={clearBoxes}>
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-center bg-gray-50 rounded-lg p-4">
              <Button variant="outline" onClick={prevImage} disabled={current === 0}>
                <ChevronLeft />
              </Button>

              <div
                ref={containerRef}
                className={`relative overflow-hidden border bg-white ${drawMode ? "cursor-crosshair" : ""}`}
                style={{ width: "700px", height: "500px" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  draggable={false}
                  className="max-w-none select-none"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                  }}
                />
                {boxes.map((box, i) => (
                  <div 
                    key={i} 
                    onClick={(e) => { 
                      e.stopPropagation();
                      deleteBox(i); 
                    }}
                    className="absolute border-2 border-green-500 bg-green-500/10 hover:bg-red-500/20 hover:border-red-500 transition-colors cursor-pointer"
                    style={{ 
                      left: box.x * zoom, 
                      top: box.y * zoom, 
                      width: box.width * zoom, 
                      height: box.height * zoom 
                    }}
                  />
                ))}
                {previewBox && (
                  <div className="absolute border-2 border-blue-500 border-dashed"
                    style={{ left: previewBox.x * zoom, top: previewBox.y * zoom, width: previewBox.width * zoom, height: previewBox.height * zoom }}
                  />
                )}
                {aiBox && (
                  <div className="absolute border-2 border-purple-500 border-dashed animate-pulse"
                    style={{ left: aiBox.x * zoom, top: aiBox.y * zoom, width: aiBox.width * zoom, height: aiBox.height * zoom }}
                  />
                )}
              </div>

              <Button variant="outline" onClick={nextImage} disabled={current === (taskItems.length || 3) - 1}>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </Card>

        {aiBox && (
          <Card className="p-4 flex gap-4 items-center bg-purple-50 border-purple-200">
            <span className="flex-1 text-purple-800 text-sm font-medium">AI has suggested a bounding box. Do you want to accept it?</span>
            <Button variant="outline" onClick={() => setAiBox(null)}>Reject</Button>
            <Button variant="gradient" onClick={acceptAI}>Accept AI</Button>
          </Card>
        )}

        <div className="flex justify-end">
          <Button variant="gradient" onClick={handleSubmit}>
            Submit Annotation
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}