import { useParams, useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"

import DashboardLayout from "../layouts/DashboardLayout"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"

import {
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from "lucide-react"

import { annotatorService } from "../services/annotatorService"

interface Box {
  x: number
  y: number
  width: number
  height: number
  labelId?: string
}

export default function AnnotatorReworkPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const imgRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [taskItems, setTaskItems] = useState<any[]>([])
  const [labels, setLabels] = useState<any[]>([])

  const [current, setCurrent] = useState(0)
  const [zoom, setZoom] = useState(1)

  const [annotations, setAnnotations] = useState<Record<number, Box[]>>({})
  const boxes = annotations[current] || []

  const [drawMode, setDrawMode] = useState(false)
  const [drawing, setDrawing] = useState(false)

  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null)
  const [previewBox, setPreviewBox] = useState<Box | null>(null)

  const [comment, setComment] = useState("")

  const feedback = taskItems[current]?.lastReviewComment || "Bounding box too loose around object."
  const errorCategory = "Bounding Box Error"

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      try {
        const itemsRes = await annotatorService.getTaskItems(id);
        if (itemsRes.isSuccess) {
          const items = itemsRes.data;
          setTaskItems(items);

          const annPromises = items.map((item: any) => 
            annotatorService.getAnnotations(item.taskItemId)
          );
          
          const annResults = await Promise.all(annPromises);
          const allAnns: Record<number, Box[]> = {};

          annResults.forEach((res, index) => {
            if (res.isSuccess) {
              allAnns[index] = res.data.map((ann: any) => ({
                x: ann.x,
                y: ann.y,
                width: ann.width,
                height: ann.height,
                labelId: ann.labelId
              }));
            }
          });
          setAnnotations(allAnns);
        }

        const labelRes = await annotatorService.getLabels(id);
        if (labelRes.isSuccess) {
          setLabels(labelRes.data);
        }
      } catch (err) {
        console.error("Load data failed:", err);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    setZoom(1);
    setComment(""); 
    setDrawMode(false);
  }, [current]);

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4))
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1))

  const getMousePosition = (e: any) => {
    const container = containerRef.current!
    const rect = container.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left + container.scrollLeft) / zoom,
      y: (e.clientY - rect.top + container.scrollTop) / zoom
    }
  }

  const handleMouseDown = (e: any) => {
    if (!drawMode) return
    e.preventDefault()
    const pos = getMousePosition(e)
    setStartPoint(pos)
    setDrawing(true)
  }

  const handleMouseMove = (e: any) => {
    if (!drawing || !startPoint) return
    const pos = getMousePosition(e)
    setPreviewBox({
      x: startPoint.x,
      y: startPoint.y,
      width: pos.x - startPoint.x,
      height: pos.y - startPoint.y
    })
  }

  const handleMouseUp = (e: any) => {
    if (!drawing || !startPoint) return
    const pos = getMousePosition(e)
    let { x, y } = startPoint
    let w = pos.x - startPoint.x
    let h = pos.y - startPoint.y

    if (w < 0) { x += w; w = Math.abs(w); }
    if (h < 0) { y += h; h = Math.abs(h); }

    const newBox: Box = {
      x, y, width: w, height: h,
      labelId: labels[0]?.labelId
    }

    setAnnotations(prev => ({
      ...prev,
      [current]: [...(prev[current] || []), newBox]
    }))

    setDrawing(false)
    setStartPoint(null)
    setPreviewBox(null)
  }

  const deleteBox = (index: number) => {
    setAnnotations(prev => ({
      ...prev,
      [current]: prev[current].filter((_, i) => i !== index)
    }))
  }

  const clearBoxes = () => {
    setAnnotations(prev => ({ ...prev, [current]: [] }))
  }

  const nextImage = () => { if (current < taskItems.length - 1) setCurrent(current + 1) }
  const prevImage = () => { if (current > 0) setCurrent(current - 1) }

  const handleResubmit = async () => {
    const taskItem = taskItems[current];
    if (!taskItem) return;

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
        alert("Task resubmitted successfully!");
        if (current === taskItems.length - 1) {
          navigate("/annotator/returned");
        } else {
          nextImage();
        }
      } else {
        alert(res.message || "Submit failed");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  }

  const imageUrl = taskItems[current]
    ? annotatorService.getImageUrl(taskItems[current].taskItemId)
    : ""

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Revise Task {id}</h1>

        {/* FEEDBACK SECTION */}
        <Card className="p-4 space-y-2">
          <h2 className="font-semibold">Reviewer Feedback</h2>
          <p className="text-sm"><strong>Error:</strong> {errorCategory}</p>
          <p className="text-sm text-red-600 italic">"{feedback}"</p>
        </Card>

        {/* ANNOTATOR CANVAS SECTION */}
        <Card className="p-6">
          <div className="flex gap-6">
            {/* TOOLBAR */}
            <div className="flex flex-col gap-3">
              <Button
                variant={drawMode ? "gradient" : "outline"}
                onClick={() => setDrawMode(!drawMode)}
                title="Draw Mode"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={zoomIn} title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={zoomOut} title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={clearBoxes} title="Clear All">
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            {/* IMAGE VIEWER */}
            <div className="flex items-center gap-4 flex-1 justify-center">
              {current > 0 && (
                <Button variant="outline" onClick={prevImage}><ChevronLeft /></Button>
              )}

              <div
                ref={containerRef}
                className={`relative border rounded-lg overflow-auto max-w-[800px] max-h-[600px] bg-slate-50 ${
                  drawMode ? "cursor-crosshair" : ""
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  draggable={false}
                  className="rounded-lg select-none origin-top-left"
                  style={{ transform: `scale(${zoom})` }}
                  alt="Task Item"
                />

                {/* RENDER BOXES */}
                {boxes.map((box, i) => (
                  <div
                    key={i}
                    onClick={(e) => { e.stopPropagation(); deleteBox(i); }}
                    className="absolute border-2 border-green-500 bg-green-500/10 hover:bg-red-500/20 hover:border-red-500 transition-colors cursor-pointer"
                    style={{
                      left: box.x * zoom,
                      top: box.y * zoom,
                      width: box.width * zoom,
                      height: box.height * zoom
                    }}
                  />
                ))}

                {/* RENDER PREVIEW */}
                {previewBox && (
                  <div
                    className="absolute border-2 border-blue-500 border-dashed pointer-events-none"
                    style={{
                      left: previewBox.x * zoom,
                      top: previewBox.y * zoom,
                      width: previewBox.width * zoom,
                      height: previewBox.height * zoom
                    }}
                  />
                )}
              </div>

              {current < taskItems.length - 1 && (
                <Button variant="outline" onClick={nextImage}><ChevronRight /></Button>
              )}
            </div>
          </div>
        </Card>

        {/* COMMENT SECTION */}
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">Comment to Reviewer</h2>
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Explain how you fixed the issues..."
          />
        </Card>

        <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant="gradient" onClick={handleResubmit} className="px-8">
                Resubmit Task
            </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}