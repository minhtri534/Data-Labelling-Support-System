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
  ChevronRight
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

  const images=[
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600"
  ]

  const [current,setCurrent]=useState(0)

  const [annotations,setAnnotations]=useState<Record<number,Box[]>>({})

  const boxes=annotations[current]||[]

  const [drawMode,setDrawMode]=useState(false)
  const [drawing,setDrawing]=useState(false)

  const [startPoint,setStartPoint]=useState<{x:number,y:number}|null>(null)

  const [comment,setComment]=useState("")

  const feedback="Bounding box too loose around object."
  const errorCategory="Bounding Box Error"

  const handleMouseDown=(e:any)=>{

    if(!drawMode) return

    const rect=imgRef.current!.getBoundingClientRect()

    setStartPoint({
      x:e.clientX-rect.left,
      y:e.clientY-rect.top
    })

    setDrawing(true)
  }

  const handleMouseUp=(e:any)=>{

    if(!drawing||!startPoint) return

    const rect=imgRef.current!.getBoundingClientRect()

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
  }

  const clearBoxes=()=>{

    setAnnotations({
      ...annotations,
      [current]:[]
    })
  }

  const nextImage=()=>{
    if(current<images.length-1) setCurrent(current+1)
  }

  const prevImage=()=>{
    if(current>0) setCurrent(current-1)
  }

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

              <Button variant="outline" onClick={clearBoxes}>
                <Trash className="w-4 h-4"/>
              </Button>

            </div>

            {/* IMAGE */}

            <div className="flex items-center gap-4">

              {current>0 &&(
                <Button variant="outline" onClick={prevImage}>
                  <ChevronLeft/>
                </Button>
              )}

              <div
                className="relative"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              >

                <img
                  ref={imgRef}
                  src={images[current]}
                  className="rounded-lg"
                />

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

              </div>

              {current<images.length-1 &&(
                <Button variant="outline" onClick={nextImage}>
                  <ChevronRight/>
                </Button>
              )}

            </div>

          </div>

        </Card>

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

        <Button variant="gradient" onClick={handleResubmit}>
          Resubmit Task
        </Button>

      </div>

    </DashboardLayout>
  )
}