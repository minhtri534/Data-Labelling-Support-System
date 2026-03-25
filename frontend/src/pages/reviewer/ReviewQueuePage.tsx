import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ClipboardCheck } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { reviewerService, type ReviewerSubmittedTaskResponse } from "../../services/reviewerService";

export default function ReviewQueuePage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ReviewerSubmittedTaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await reviewerService.getSubmittedTasks();
        if (res.isSuccess) {
          setTasks(res.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hàng đợi kiểm duyệt</h1>
          <p className="text-gray-500">Danh sách các tác vụ đã nộp đang chờ đánh giá chất lượng</p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p>Đang tải danh sách kiểm duyệt...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="p-5 flex justify-between items-center hover:bg-blue-50/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900">{task.projectName}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">ID: {task.id.slice(-6)}</span>
                      <span>•</span>
                      <span className="font-medium text-gray-700">Người dán nhãn: {task.annotatorName}</span>
                      <span>•</span>
                      <span>Nộp lúc: {new Date(task.submittedAt).toLocaleString('vi-VN')}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant="primary">Đã nộp</Badge>
                  <Button 
                    onClick={() => navigate(`/review/${task.id}`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Bắt đầu Review
                  </Button>
                </div>
              </Card>
            ))}

            {tasks.length === 0 && (
              <div className="py-20 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Tuyệt vời! Không còn tác vụ nào đang chờ kiểm duyệt.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
