import { useState, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

import {
  Bot,
  Trash,
  Pencil,
  MousePointer,
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

  const imgRef = useRef<HTMLImageElement|null>(null)

  const images = [
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600"
  ]

  const [current,setCurrent] = useState(0)

  const [annotations,setAnnotations] = useState<Record<number,Box[]>>({})

  const boxes = annotations[current] || []

  const [drawMode,setDrawMode] = useState(false)
  const [drawing,setDrawing] = useState(false)

  const [startPoint,setStartPoint] = useState<{x:number,y:number}|null>(null)

  const [previewBox,setPreviewBox] = useState<Box|null>(null)

  const [aiBox,setAiBox] = useState<Box|null>(null)

  // START DRAW
  const handleMouseDown=(e:any)=>{

    if(!drawMode) return

    const rect = imgRef.current!.getBoundingClientRect()

    const startX=e.clientX-rect.left
    const startY=e.clientY-rect.top

    setStartPoint({
      x:startX,
      y:startY
    })

    setDrawing(true)
  }

  // DRAG PREVIEW
  const handleMouseMove=(e:any)=>{

    if(!drawing || !startPoint) return

    const rect = imgRef.current!.getBoundingClientRect()

    const currentX=e.clientX-rect.left
    const currentY=e.clientY-rect.top

    setPreviewBox({
      x:startPoint.x,
      y:startPoint.y,
      width:currentX-startPoint.x,
      height:currentY-startPoint.y
    })
  }

  // FINISH DRAW
  const handleMouseUp=(e:any)=>{

    if(!drawing || !startPoint) return

    const rect = imgRef.current!.getBoundingClientRect()

    const endX=e.clientX-rect.left
    const endY=e.clientY-rect.top

    const newBox:Box={
      x:startPoint.x,
      y:startPoint.y,
      width:endX-startPoint.x,
      height:endY-startPoint.y
    }

    const updated=[...boxes,newBox]

    setAnnotations({
      ...annotations,
      [current]:updated
    })

    setDrawing(false)
    setStartPoint(null)
    setPreviewBox(null)
  }

  const clearBoxes=()=>{

    setAnnotations({
      ...annotations,
      [current]:[]
    })
  }

  // MOCK AI
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

  const nextImage=()=>{

    if(current<images.length-1){
      setCurrent(current+1)
      setAiBox(null)
    }
  }

  const prevImage=()=>{

    if(current>0){
      setCurrent(current-1)
      setAiBox(null)
    }
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

              <Button
                variant="outline"
                onClick={clearBoxes}
              >
                <Trash className="w-4 h-4"/>
              </Button>

              <Button variant="outline">
                <MousePointer className="w-4 h-4"/>
              </Button>

            </div>

            {/* IMAGE AREA */}

            <div className="flex items-center gap-4">

              {current>0 && (
                <Button variant="outline" onClick={prevImage}>
                  <ChevronLeft/>
                </Button>
              )}

              <div
                className={`relative ${drawMode ? "cursor-crosshair":""}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >

                <img
                  ref={imgRef}
                  src={images[current]}
                  className="rounded-lg"
                />

                {/* USER BOXES */}

                {boxes.map((box,i)=>(
                  <div
                    key={i}
                    className="absolute border-2 border-green-500"
                    style={{
                      left:box.x,
                      top:box.y,
                      width:box.width,
                      height:box.height
                    }}
                  />
                ))}

                {/* PREVIEW */}

                {previewBox &&(
                  <div
                    className="absolute border-2 border-blue-500 border-dashed"
                    style={{
                      left:previewBox.x,
                      top:previewBox.y,
                      width:previewBox.width,
                      height:previewBox.height
                    }}
                  />
                )}

                {/* AI BOX */}

                {aiBox &&(
                  <div
                    className="absolute border-2 border-purple-500 border-dashed"
                    style={{
                      left:aiBox.x,
                      top:aiBox.y,
                      width:aiBox.width,
                      height:aiBox.height
                    }}
                  />
                )}

              </div>

              {current<images.length-1 &&(
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

      </div>

    </DashboardLayout>
  )
}