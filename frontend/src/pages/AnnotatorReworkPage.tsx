import { useParams,useNavigate } from "react-router-dom"
import { useState,useRef } from "react"

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

interface Box{
  x:number
  y:number
  width:number
  height:number
}

export default function AnnotatorReworkPage(){

  const {id}=useParams()
  const navigate=useNavigate()

  const imgRef=useRef<HTMLImageElement|null>(null)
  const containerRef=useRef<HTMLDivElement|null>(null)

  const images=[
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600"
  ]

  const [current,setCurrent]=useState(0)
  const [zoom,setZoom]=useState(1)

  const [annotations,setAnnotations]=useState<Record<number,Box[]>>({})
  const boxes=annotations[current]||[]

  const [drawMode,setDrawMode]=useState(false)
  const [drawing,setDrawing]=useState(false)

  const [startPoint,setStartPoint]=useState<{x:number,y:number}|null>(null)
  const [previewBox,setPreviewBox]=useState<Box|null>(null)

  const [comment,setComment]=useState("")

  const feedback="Bounding box too loose around object."
  const errorCategory="Bounding Box Error"

  // ---------------- ZOOM ----------------

  const zoomIn=()=>{
    setZoom(prev=>Math.min(prev+0.5,4))
  }

  const zoomOut=()=>{
    setZoom(prev=>Math.max(prev-0.5,1))
  }

  // ---------------- GET MOUSE POSITION ----------------

  const getMousePosition=(e:any)=>{

    const container=containerRef.current!
    const rect=container.getBoundingClientRect()

    return{
      x:(e.clientX-rect.left+container.scrollLeft)/zoom,
      y:(e.clientY-rect.top+container.scrollTop)/zoom
    }

  }

  // ---------------- DRAW ----------------

  const handleMouseDown=(e:any)=>{

    if(!drawMode) return

    e.preventDefault()

    const pos=getMousePosition(e)

    setStartPoint(pos)
    setDrawing(true)
  }

  const handleMouseMove=(e:any)=>{

    if(!drawing||!startPoint) return

    const pos=getMousePosition(e)

    setPreviewBox({
      x:startPoint.x,
      y:startPoint.y,
      width:pos.x-startPoint.x,
      height:pos.y-startPoint.y
    })
  }

  const handleMouseUp=(e:any)=>{

    if(!drawing||!startPoint) return

    const pos=getMousePosition(e)

    let x=startPoint.x
    let y=startPoint.y
    let w=pos.x-startPoint.x
    let h=pos.y-startPoint.y

    if(w<0){
      x+=w
      w=Math.abs(w)
    }

    if(h<0){
      y+=h
      h=Math.abs(h)
    }

    const newBox:Box={
      x,
      y,
      width:w,
      height:h
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

  // ---------------- DELETE BOX ----------------

  const deleteBox=(index:number)=>{

    const updated=boxes.filter((_,i)=>i!==index)

    setAnnotations({
      ...annotations,
      [current]:updated
    })

  }

  // ---------------- CLEAR ----------------

  const clearBoxes=()=>{

    setAnnotations({
      ...annotations,
      [current]:[]
    })

  }

  // ---------------- NAVIGATION ----------------

  const nextImage=()=>{
    if(current<images.length-1) setCurrent(current+1)
  }

  const prevImage=()=>{
    if(current>0) setCurrent(current-1)
  }

  // ---------------- SUBMIT ----------------

  const handleResubmit=()=>{

    const payload={
      taskId:id,
      annotations,
      comment
    }

    console.log(payload)

    alert("Task resubmitted!")

    navigate("/annotator/returned")
  }

  return(

    <DashboardLayout>

      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold">
          Revise Task {id}
        </h1>

        {/* REVIEWER FEEDBACK */}

        <Card className="p-4 space-y-2">

          <h2 className="font-semibold">
            Reviewer Feedback
          </h2>

          <p className="text-sm">
            <strong>Error:</strong> {errorCategory}
          </p>

          <p className="text-sm text-red-600">
            {feedback}
          </p>

        </Card>

        {/* ANNOTATION AREA */}

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
                  drawMode?"cursor-crosshair":""
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

                {/* SAVED BOXES */}

                {boxes.map((box,i)=>(

                  <div
                    key={i}
                    onClick={()=>deleteBox(i)}
                    className="absolute border-2 border-green-500 cursor-pointer"
                    style={{
                      left:box.x*zoom,
                      top:box.y*zoom,
                      width:box.width*zoom,
                      height:box.height*zoom
                    }}
                  />

                ))}

                {/* PREVIEW BOX */}

                {previewBox&&(

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

              </div>

              {current<images.length-1 &&(
                <Button variant="outline" onClick={nextImage}>
                  <ChevronRight/>
                </Button>
              )}

            </div>

          </div>

        </Card>

        {/* COMMENT */}

        <Card className="p-4 space-y-3">

          <h2 className="font-semibold">
            Comment to Reviewer
          </h2>

          <Input
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
            placeholder="Explain your correction..."
          />

        </Card>

        {/* SUBMIT */}

        <Button
          variant="gradient"
          onClick={handleResubmit}
        >
          Resubmit Task
        </Button>

      </div>

    </DashboardLayout>
  )
}