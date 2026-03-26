import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ArrowLeft, PlayCircle, FileText, Clock, CheckCircle, Loader2 } from "lucide-react";
import { annotatorService } from "../../services/annotatorService";
import type { AnnotatorTaskSummary } from "../../types/annotator";

const AnnotatorTaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<AnnotatorTaskSummary | null>(null);
  const [guideline, setGuideline] = useState<string>("Loading guideline...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!taskId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [taskRes, guidelineRes] = await Promise.all([
          annotatorService.getMyTasks(),
          annotatorService.getGuideline(taskId),
        ]);

        if (taskRes.isSuccess) {
          const found = (taskRes.data || []).find((t) => t.id === taskId) || null;
          setTask(found);
        }

        if (guidelineRes.isSuccess) {
          setGuideline(guidelineRes.data?.guideline || "No specific guideline for this project.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [taskId]);

  const statusLabel = useMemo(() => {
    if (!task) return "Unknown";
    if (task.status === "InProgress") return "In Progress";
    if (task.status === "Assigned") return "Assigned";
    if (task.status === "Submitted") return "Submitted";
    if (task.status === "Returned") return "Needs Revision";
    return task.status;
  }, [task]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-96 flex flex-col items-center justify-center gap-3 text-gray-600">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p>Loading task details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-20">
          <Card className="p-12 text-center text-gray-500 border-dashed">
            Task not found or you do not have access.
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/annotator/tasks">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Task Details #{task.id.slice(-6)}</h1>
              <p className="text-gray-500 mt-1">Task details and instructions.</p>
            </div>
          </div>
          {task.status !== "Submitted" && (
            <Link to={`/annotator/ai-label/${taskId}`}>
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 px-6">
                <PlayCircle className="h-4 w-4 mr-2" />
                Bắt đầu dán nhãn
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Task Info */}
          <Card className="p-8 col-span-2 space-y-8 border-none shadow-sm">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-blue-600 h-5 w-5" />
                Task Description
              </h3>
              <div className="p-4 bg-gray-50 rounded-xl text-gray-600 border border-gray-100">
                This task belongs to project <span className="font-semibold text-gray-900">{task.projectId}</span>.
                You need to label the data item <span className="font-semibold text-gray-900">{task.dataItemId}</span>
                according to the project guideline.
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">Guidelines</h3>
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-blue-900 whitespace-pre-wrap italic">
                {guideline}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Current Progress</h3>
              <div className="max-w-md mx-auto">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${task.status === "Submitted" ? 100 : task.status === "InProgress" ? 50 : 10}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-gray-500">Status: <span className="font-bold text-blue-600 uppercase tracking-wide ml-1">{statusLabel}</span></span>
                  <span className="text-gray-400 font-medium">{task.status === "Submitted" ? "100%" : task.status === "InProgress" ? "50%" : "0%"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="p-6 space-y-6 h-fit border-none shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Status
                </h3>
                <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                  <CheckCircle className="h-6 w-6" />
                  {statusLabel}
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Thời gian giao
                </h3>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Clock className="h-5 w-5 text-gray-400" />
                  {task.assignedAt ? new Date(task.assignedAt).toLocaleString('en-US') : "-"}
                </div>
              </div>

              {task.status === "Returned" && feedback.length > 0 && (
                <div className="pt-6 border-t border-red-100">
                  <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MessageSquareWarning className="h-4 w-4" />
                    Feedback from Reviewer
                  </h3>
                  {feedback.map(fb => (
                    <div key={fb.id} className="p-4 bg-red-50 text-red-800 rounded-lg text-sm mb-3 border border-red-100">
                      <p className="italic">“{fb.comment}”</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {fb.errorCategories.map(cat => (
                          <span key={cat.id} className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-red-400 mt-2 text-right">{new Date(fb.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 bg-gray-900 text-white border-none shadow-xl">
              <h3 className="font-bold mb-2">Need help?</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  If you encounter issues while labeling, contact the Project Manager or refer to the project Guideline.
                </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnnotatorTaskDetailPage;