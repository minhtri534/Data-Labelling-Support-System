import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { annotatorService } from "../../services/annotatorService";
import type { AnnotatorTaskSummary, LabelResponse, UpsertTaskAnnotationsPayload } from "../../types/annotator";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Save,
  Send,
  Trash,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
  labelId: string;
}

const FALLBACK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export default function AnnotatorAILabelPage() {
  const { id: taskIdFromUrl } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [task, setTask] = useState<AnnotatorTaskSummary | null>(null);
  const [labels, setLabels] = useState<LabelResponse[]>([]);
  const [guideline, setGuideline] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [drawMode, setDrawMode] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [previewBox, setPreviewBox] = useState<Box | null>(null);

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedLabelId, setSelectedLabelId] = useState<string>("");
  const [secureImageUrl, setSecureImageUrl] = useState<string>("");

  const currentTaskId = task?.id || "";

  const loadTaskContext = async (taskId: string) => {
    const [taskRes, labelsRes, guidelineRes, annRes] = await Promise.all([
      annotatorService.getMyTasks(),
      annotatorService.getLabels(taskId),
      annotatorService.getGuideline(taskId),
      annotatorService.getAnnotations(taskId),
    ]);

    if (taskRes.isSuccess) {
      const found = (taskRes.data || []).find((x) => x.id === taskId) || null;
      setTask(found);
    }

    if (labelsRes.isSuccess) {
      const labelData = labelsRes.data || [];
      setLabels(labelData);
      if (!selectedLabelId && labelData.length > 0) {
        setSelectedLabelId(labelData[0].id);
      }
    }

    if (guidelineRes.isSuccess) {
      setGuideline(guidelineRes.data?.guideline || "");
    }

    if (annRes.isSuccess) {
      const parsed = (annRes.data || [])
        .map((ann) => {
          try {
            const geo = JSON.parse(ann.geometryData) as {
              x?: number;
              y?: number;
              width?: number;
              height?: number;
            };
            if (
              typeof geo.x !== "number" ||
              typeof geo.y !== "number" ||
              typeof geo.width !== "number" ||
              typeof geo.height !== "number"
            ) {
              return null;
            }

            return {
              x: geo.x,
              y: geo.y,
              width: geo.width,
              height: geo.height,
              labelId: ann.labelId,
            } as Box;
          } catch {
            return null;
          }
        })
        .filter((x): x is Box => x !== null);

      setBoxes(parsed);
    } else {
      setBoxes([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        let activeId = taskIdFromUrl || "";

        if (!activeId) {
          const taskRes = await annotatorService.getMyTasks();
          if (taskRes.isSuccess) {
            const preferred = (taskRes.data || []).find((x) => x.status !== "Submitted") || taskRes.data?.[0];
            if (preferred) {
              activeId = preferred.id;
              navigate(`/annotator/ai-label/${preferred.id}`, { replace: true });
            }
          }
        }

        if (!activeId) {
          setTask(null);
          return;
        }

        await annotatorService.startTask(activeId);
        await loadTaskContext(activeId);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [taskIdFromUrl, navigate]);

  useEffect(() => {
    let objectUrl = "";
    const loadImage = async () => {
      if (!currentTaskId) return;
      try {
        const blob = await annotatorService.getImageSecure(currentTaskId);
        objectUrl = URL.createObjectURL(blob);
        setSecureImageUrl(objectUrl);
      } catch {
        setSecureImageUrl(FALLBACK_IMAGE);
      }
    };

    loadImage();
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentTaskId]);

  const savePayload: UpsertTaskAnnotationsPayload = useMemo(
    () => ({
      objects: boxes.map((b) => ({
        labelId: b.labelId,
        geometryData: {
          type: "bbox",
          x: Math.round(b.x),
          y: Math.round(b.y),
          width: Math.round(b.width),
          height: Math.round(b.height),
        },
      })),
    }),
    [boxes]
  );

  const handleSave = async (isSubmit: boolean) => {
    if (!currentTaskId || savePayload.objects.length === 0) return;

    setSaving(true);
    try {
      const res = isSubmit
        ? await annotatorService.submit(currentTaskId, savePayload)
        : await annotatorService.saveDraft(currentTaskId, savePayload);

      if (res.isSuccess && isSubmit) {
        navigate("/annotator/tasks");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAiSuggest = async () => {
    if (!currentTaskId) return;

    setAiLoading(true);
    try {
      const res = await annotatorService.suggestAi(currentTaskId, false);
      if (!res.isSuccess || !res.data) return;

      const aiBoxes = res.data.objects
        .map((obj) => {
          try {
            const geo = JSON.parse(obj.geometryData) as {
              x?: number;
              y?: number;
              width?: number;
              height?: number;
            };

            if (
              typeof geo.x !== "number" ||
              typeof geo.y !== "number" ||
              typeof geo.width !== "number" ||
              typeof geo.height !== "number"
            ) {
              return null;
            }

            return {
              x: geo.x,
              y: geo.y,
              width: geo.width,
              height: geo.height,
              labelId: obj.labelId,
            } as Box;
          } catch {
            return null;
          }
        })
        .filter((x): x is Box => x !== null);

      if (aiBoxes.length > 0) {
        setBoxes(aiBoxes);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const getMousePosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawMode) return;
    setStartPoint(getMousePosition(e));
    setDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawing || !startPoint) return;
    const p = getMousePosition(e);
    setPreviewBox({
      x: Math.min(startPoint.x, p.x),
      y: Math.min(startPoint.y, p.y),
      width: Math.abs(startPoint.x - p.x),
      height: Math.abs(startPoint.y - p.y),
      labelId: selectedLabelId,
    });
  };

  const handleMouseUp = () => {
    if (!drawing || !previewBox || previewBox.width < 5 || previewBox.height < 5 || !selectedLabelId) {
      setDrawing(false);
      setPreviewBox(null);
      return;
    }

    setBoxes((prev) => [...prev, { ...previewBox, labelId: selectedLabelId }]);
    setDrawing(false);
    setPreviewBox(null);
    setStartPoint(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <Card className="max-w-4xl mx-auto p-10 text-center text-gray-600">Không có task để gán nhãn.</Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-4 pb-10">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Annotation Workspace</h1>
            <p className="text-xs text-slate-500">Task: {task.id} | DataItem: {task.dataItemId}</p>
          </div>
          <div className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold">1 / 1</div>
        </div>

        <Card className="p-4 flex gap-4 bg-white border-none shadow-lg">
          <div className="w-60 flex-shrink-0 space-y-4 border-r pr-4">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Labels</p>
              <div className="space-y-2">
                {labels.map((label) => (
                  <Button
                    key={label.id}
                    variant={selectedLabelId === label.id ? "primary" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedLabelId(label.id)}
                  >
                    {label.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Guideline</p>
              <div className="text-xs bg-blue-50 border border-blue-100 text-blue-900 rounded-lg p-3 whitespace-pre-wrap">
                {guideline || "Chưa có guideline"}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant={drawMode ? "gradient" : "outline"} size="icon" onClick={() => setDrawMode((x) => !x)}>
                <Pencil className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.min(3, z + 0.2))}>
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}>
                <ZoomOut className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="col-span-3" onClick={() => setBoxes([])}>
                <Trash className="w-5 h-5 text-red-500" />
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-slate-900 rounded-2xl p-4 flex items-center justify-center relative min-h-[500px] shadow-inner">
            <Button variant="ghost" className="text-white hover:bg-white/10 absolute left-2 z-10" disabled>
              <ChevronLeft className="w-8 h-8" />
            </Button>

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

              {boxes.map((box, i) => (
                <div
                  key={`${box.labelId}-${i}`}
                  className="absolute border-2 border-emerald-400 bg-emerald-400/20"
                  style={{
                    left: box.x * zoom,
                    top: box.y * zoom,
                    width: box.width * zoom,
                    height: box.height * zoom,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setBoxes((prev) => prev.filter((_, idx) => idx !== i));
                  }}
                />
              ))}

              {previewBox && (
                <div
                  className="absolute border-2 border-blue-400 border-dashed bg-blue-400/10"
                  style={{
                    left: previewBox.x * zoom,
                    top: previewBox.y * zoom,
                    width: previewBox.width * zoom,
                    height: previewBox.height * zoom,
                  }}
                />
              )}
            </div>

            <Button variant="ghost" className="text-white hover:bg-white/10 absolute right-2 z-10" disabled>
              <ChevronRight className="w-8 h-8" />
            </Button>
          </div>
        </Card>

        <div className="flex justify-between gap-3 mt-4">
          <Button variant="outline" size="lg" onClick={handleAiSuggest} disabled={aiLoading}>
            {aiLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Bot className="w-4 h-4 mr-2" />}
            AI Suggest
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => handleSave(false)} disabled={saving || boxes.length === 0}>
              {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button variant="gradient" size="lg" onClick={() => handleSave(true)} disabled={saving || boxes.length === 0}>
              <Send className="w-4 h-4 mr-2" />
              Submit Task
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
