import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

import {
  Bot,
  Trash,
  Pencil,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Box {
  x:number
  y:number
  width:number
  height:number
}

export default function AnnotatorAILabelPage(){

  const navigate = useNavigate()

  const imgRef = useRef<HTMLImageElement|null>(null)
  const containerRef = useRef<HTMLDivElement|null>(null)

  const images = [
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600"
  ]

  const [current,setCurrent] = useState(0)
  const [zoom,setZoom] = useState(1)

  const [annotations,setAnnotations] = useState<Record<number,Box[]>>({})
  const boxes = annotations[current] || []

  const [drawMode,setDrawMode] = useState(false)
  const [drawing,setDrawing] = useState(false)

  const [startPoint,setStartPoint] = useState<{x:number,y:number}|null>(null)
  const [previewBox,setPreviewBox] = useState<Box|null>(null)

  const [aiBox,setAiBox] = useState<Box|null>(null)

  // ---------------- ZOOM ----------------

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5,4))
  }

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5,1))
  }

  // ---------------- GET MOUSE POSITION ----------------

  const getMousePosition=(e:any)=>{

    const container = containerRef.current!
    const rect = container.getBoundingClientRect()

    return{
      x:(e.clientX - rect.left + container.scrollLeft)/zoom,
      y:(e.clientY - rect.top + container.scrollTop)/zoom
    }

  }

  // ---------------- DRAW ----------------

  const handleMouseDown=(e:any)=>{

    if(!drawMode) return

    e.preventDefault()

    const pos = getMousePosition(e)

    setStartPoint(pos)
    setDrawing(true)

  }

  const handleMouseMove=(e:any)=>{

    if(!drawing || !startPoint) return

    const pos = getMousePosition(e)

    setPreviewBox({
      x:startPoint.x,
      y:startPoint.y,
      width:pos.x-startPoint.x,
      height:pos.y-startPoint.y
    })

  }

  const handleMouseUp=(e:any)=>{

    if(!drawing || !startPoint) return

    const pos = getMousePosition(e)

    let x = startPoint.x
    let y = startPoint.y
    let w = pos.x - startPoint.x
    let h = pos.y - startPoint.y

    if(w < 0){
      x += w
      w = Math.abs(w)
    }

    if(h < 0){
      y += h
      h = Math.abs(h)
    }

    const newBox:Box={x,y,width:w,height:h}

    const updated=[...boxes,newBox]

    setAnnotations({
      ...annotations,
      [current]:updated
    })

    setDrawing(false)
    setStartPoint(null)
    setPreviewBox(null)

  }

  // ---------------- CLEAR ----------------

  const clearBoxes=()=>{
    setAnnotations({
      ...annotations,
      [current]:[]
    })
  }

  // ---------------- AI ----------------

  const handleRequestAI=()=>{
    const box={
      x:150,
      y:80,
      width:120,
      height:100
    }
    setAiBox(box)
  }

  const acceptAI=()=>{

    if(!aiBox) return

    const updated=[...boxes,aiBox]

    setAnnotations({
      ...annotations,
      [current]:updated
    })

    setAiBox(null)

  }

  const rejectAI=()=>setAiBox(null)

  // ---------------- NAVIGATION ----------------

  const nextImage=()=>{
    if(current < images.length-1){
      setCurrent(current+1)
      setAiBox(null)
    }
  }

  const prevImage=()=>{
    if(current > 0){
      setCurrent(current-1)
      setAiBox(null)
    }
  }

  // ---------------- SUBMIT ----------------

  const handleSubmit=()=>{

    const payload={
      taskId:"task-demo-001",
      annotations
    }

    console.log("Submit Payload:",payload)

    alert("Task submitted successfully!")

    // sau này có thể redirect
    navigate("/annotator/returned")

  }

  return(
    <DashboardLayout>

      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold">
          AI Assisted Annotation
        </h1>

        <Card className="p-6">

          <div className="flex gap-6">

            {/* TOOLBAR */}

            <div className="flex flex-col gap-3">

              <Button
                variant={drawMode?"gradient":"outline"}
                onClick={()=>setDrawMode(!drawMode)}
              >
                <Pencil className="w-4 h-4"/>
              </Button>

              <Button
                variant="outline"
                onClick={handleRequestAI}
              >
                <Bot className="w-4 h-4"/>
              </Button>

              <Button variant="outline" onClick={zoomIn}>
                <ZoomIn className="w-4 h-4"/>
              </Button>

              <Button variant="outline" onClick={zoomOut}>
                <ZoomOut className="w-4 h-4"/>
              </Button>

              <Button variant="outline" onClick={clearBoxes}>
                <Trash className="w-4 h-4"/>
              </Button>

            </div>

            {/* IMAGE AREA */}

            <div className="flex items-center gap-4">

              {current>0 &&(
                <Button variant="outline" onClick={prevImage}>
                  <ChevronLeft/>
                </Button>
              )}

              <div
                ref={containerRef}
                className={`relative overflow-auto max-w-[700px] max-h-[500px] ${
                  drawMode ? "cursor-crosshair":""
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >

                <img
                  ref={imgRef}
                  src={images[current]}
                  draggable={false}
                  className="rounded-lg select-none"
                  style={{
                    transform:`scale(${zoom})`,
                    transformOrigin:"top left",
                    userSelect:"none"
                  }}
                />

                {boxes.map((box,i)=>(
                  <div
                    key={i}
                    className="absolute border-2 border-green-500"
                    style={{
                      left:box.x*zoom,
                      top:box.y*zoom,
                      width:box.width*zoom,
                      height:box.height*zoom
                    }}
                  />
                ))}

                {previewBox &&(
                  <div
                    className="absolute border-2 border-blue-500 border-dashed"
                    style={{
                      left:previewBox.x*zoom,
                      top:previewBox.y*zoom,
                      width:previewBox.width*zoom,
                      height:previewBox.height*zoom
                    }}
                  />
                )}

                {aiBox &&(
                  <div
                    className="absolute border-2 border-purple-500 border-dashed"
                    style={{
                      left:aiBox.x*zoom,
                      top:aiBox.y*zoom,
                      width:aiBox.width*zoom,
                      height:aiBox.height*zoom
                    }}
                  />
                )}

              </div>

              {current < images.length-1 &&(
                <Button variant="outline" onClick={nextImage}>
                  <ChevronRight/>
                </Button>
              )}

            </div>

          </div>

        </Card>

        {aiBox &&(

          <Card className="p-4 flex gap-4">

            <Button variant="gradient" onClick={acceptAI}>
              Accept AI
            </Button>

            <Button variant="outline" onClick={rejectAI}>
              Reject AI
            </Button>

          </Card>

        )}

        {/* SUBMIT BUTTON */}

        <div className="flex justify-end">
          <Button variant="gradient" onClick={handleSubmit}>
            Submit Annotation
          </Button>
        </div>

      </div>

    </DashboardLayout>
  )
}