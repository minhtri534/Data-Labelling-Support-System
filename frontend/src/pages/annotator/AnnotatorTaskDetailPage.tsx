import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ArrowLeft, PlayCircle, FileText, Clock, CheckCircle } from "lucide-react";

const AnnotatorTaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();

  // Mock data for task details
  const task = {
    id: taskId,
    name: "Labeling Batch 1",
    description: "Gán nhãn cho tập dữ liệu hình ảnh xe cộ.",
    deadline: "2023-12-31",
    status: "In Progress",
    progress: 45,
    totalItems: 100,
    completedItems: 45,
    guidelines: "Vui lòng gán nhãn chính xác theo hướng dẫn.",
  };

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
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{task.name}</h1>
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
              <p className="text-gray-600">{task.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Hướng dẫn</h3>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-blue-800">
                <FileText className="h-5 w-5 inline-block mr-2" />
                {task.guidelines}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Tiến độ</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Đã hoàn thành {task.completedItems} / {task.totalItems} mục ({task.progress}%)
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
                {task.status}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                Hạn chót
              </h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5" />
                {task.deadline}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnnotatorTaskDetailPage;
