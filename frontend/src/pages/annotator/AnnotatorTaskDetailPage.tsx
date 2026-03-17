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
  const [guideline, setGuideline] = useState<string>("Đang tải guideline...");
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
          setGuideline(guidelineRes.data?.guideline || "Chưa có guideline cho project này.");
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
    return task.status;
  }, [task]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-96 flex items-center justify-center gap-3 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Đang tải task...
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center text-gray-600">Không tìm thấy task hoặc bạn không có quyền truy cập.</Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/annotator/tasks">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Task {task.id.slice(-6)}</h1>
              <p className="text-gray-500 mt-1">Chi tiết công việc gán nhãn.</p>
            </div>
          </div>
          <Link to={`/annotator/task/${taskId}/label`}>
            <Button variant="primary">
              <PlayCircle className="h-4 w-4 mr-2" />
              Bắt đầu gán nhãn
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Task Info */}
          <Card variant="glass" className="p-6 col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
              <p className="text-gray-600">Task thuộc project {task.projectId} với data item {task.dataItemId}.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Hướng dẫn</h3>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-blue-800">
                <FileText className="h-5 w-5 inline-block mr-2" />
                {guideline}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Tiến độ</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${task.status === "Submitted" ? 100 : task.status === "InProgress" ? 50 : 10}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Trạng thái hiện tại: {statusLabel}
              </p>
            </div>
          </Card>

          {/* Sidebar Info */}
          <Card variant="glass" className="p-6 space-y-6 h-fit">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                Trạng thái
              </h3>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <CheckCircle className="h-5 w-5" />
                {statusLabel}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                Assigned At
              </h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5" />
                {task.assignedAt ? new Date(task.assignedAt).toLocaleString() : "-"}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnnotatorTaskDetailPage;
