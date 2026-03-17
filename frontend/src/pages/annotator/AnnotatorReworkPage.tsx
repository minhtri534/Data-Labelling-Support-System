import { useParams, useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import {
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2
} from "lucide-react"
import { annotatorService } from "../../services/annotatorService"

interface Box {
  x: number
  y: number
  width: number
  height: number
  labelId?: string
}

const FALLBACK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export default function AnnotatorReworkPage() {
  const { id: taskId } = useParams()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [taskItems, setTaskItems] = useState<any[]>([])
  const [labels, setLabels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [secureImageUrl, setSecureImageUrl] = useState<string>("")

  const [annotations, setAnnotations] = useState<Record<number, Box[]>>({})
  const [drawMode, setDrawMode] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null)
  const [previewBox, setPreviewBox] = useState<Box | null>(null)
  const [comment, setComment] = useState("")

  const currentItem = taskItems[current]
  const boxes = annotations[current] || []
  
  // Thông tin feedback từ reviewer
  const feedback = currentItem?.lastReviewComment || "Please check the bounding boxes again."
  const errorCategory = "Revision Required"

  // 1. Tải Task Items và Labels
  useEffect(() => {
    const loadData = async () => {
      if (!taskId) return;
      setLoading(true);
      try {
        const [itemsRes, labelsRes] = await Promise.all([
          annotatorService.getTaskItems(taskId),
          annotatorService.getLabels(taskId)
        ]);

        if (itemsRes.isSuccess && itemsRes.data) {
          const items = itemsRes.data;
          setTaskItems(items);

          // Tải annotations cũ cho từng item
          const initialAnns: Record<number, Box[]> = {};
          await Promise.all(items.map(async (item: any, index: number) => {
            const annRes = await annotatorService.getAnnotations(item.taskId);
            if (annRes.isSuccess && annRes.data) {
              initialAnns[index] = annRes.data.map((ann: any) => {
                try {
                  const geometry = typeof ann.geometryData === 'string' 
                    ? JSON.parse(ann.geometryData) 
                    : ann.geometryData;
                  return { ...geometry, labelId: ann.labelId };
                } catch (e) { return null; }
              }).filter((b: any) => b !== null);
            }
          }));
          setAnnotations(initialAnns);
        }
        if (labelsRes.isSuccess) setLabels(labelsRes.data);
      } catch (err) {
        console.error("Load data failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [taskId]);

  // 2. Tải ảnh bảo mật (Blob) mỗi khi đổi item
  useEffect(() => {
    let objectUrl = "";
    const fetchImage = async () => {
      if (!currentItem) return;
      try {
        const blob = await annotatorService.getImageSecure(currentItem.taskId);
        objectUrl = URL.createObjectURL(blob);
        setSecureImageUrl(objectUrl);
      } catch (error) {
        setSecureImageUrl(FALLBACK_IMAGE);
      }
    };
    fetchImage();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [currentItem]);

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

  const handleResubmit = async () => {
    if (!currentItem) return;
    try {
      const payload = {
        objects: boxes.map(b => ({
          labelId: b.labelId || labels[0]?.id,
          geometryData: {
            type: "bbox",
            x: Math.round(b.x), y: Math.round(b.y),
            width: Math.round(b.width), height: Math.round(b.height)
          }
        })),
      };

      const res = await annotatorService.submit(currentItem.taskId, payload);
      if (res.isSuccess) {
        if (current === taskItems.length - 1) {
          navigate("/annotator/returned");
        } else {
          setCurrent(current + 1);
        }
      }
    } catch (err) {
      console.error("Resubmit failed");
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Revise Task: {taskId}</h1>

        <Card className="p-4 bg-red-50 border-red-200">
          <h2 className="font-semibold text-red-800">Reviewer Feedback</h2>
          <p className="text-sm text-red-700 mt-1"><strong>Category:</strong> {errorCategory}</p>
          <p className="text-sm text-red-600 italic mt-1">"{feedback}"</p>
        </Card>

        <Card className="p-6">
          <div className="flex gap-6">
            <div className="flex flex-col gap-3">
              <Button variant={drawMode ? "gradient" : "outline"} onClick={() => setDrawMode(!drawMode)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}><ZoomIn className="w-4 h-4" /></Button>
              <Button variant="outline" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}><ZoomOut className="w-4 h-4" /></Button>
              <Button variant="outline" onClick={() => setAnnotations({...annotations, [current]: []})}><Trash className="w-4 h-4 text-red-500" /></Button>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-center bg-slate-200 rounded-lg p-4 min-h-[550px]">
              <Button variant="ghost" onClick={() => setCurrent(c => c - 1)} disabled={current === 0}><ChevronLeft /></Button>

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
                    draggable={false}
                    className="max-w-none select-none origin-top-left"
                    style={{ transform: `scale(${zoom})` }}
                    alt="Task Item"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                )}

                {boxes.map((box, i) => (
                  <div
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setAnnotations(prev => ({...prev, [current]: prev[current].filter((_, idx) => idx !== i)})); }}
                    className="absolute border-2 border-green-500 bg-green-500/10 hover:bg-red-500/30 cursor-pointer"
                    style={{ left: box.x * zoom, top: box.y * zoom, width: box.width * zoom, height: box.height * zoom }}
                  />
                ))}

                {previewBox && (
                  <div className="absolute border-2 border-blue-400 border-dashed bg-blue-400/10"
                    style={{ left: previewBox.x * zoom, top: previewBox.y * zoom, width: previewBox.width * zoom, height: previewBox.height * zoom }}
                  />
                )}
              </div>

              <Button variant="ghost" onClick={() => setCurrent(c => c + 1)} disabled={current === taskItems.length - 1}><ChevronRight /></Button>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">Comment to Reviewer</h2>
          <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Explain how you fixed the issues..." />
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="gradient" onClick={handleResubmit} className="px-8">
            {current === taskItems.length - 1 ? "Complete Revision" : "Next & Save"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}