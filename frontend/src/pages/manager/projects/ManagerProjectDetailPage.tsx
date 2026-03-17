import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Archive, PlayCircle, PauseCircle, Users, Calendar, DollarSign, FileText, CheckCircle, Clock } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

// Mock data for a single project
const project = {
  id: "PROJ-001",
  name: "Phân tích cảm xúc bình luận sản phẩm",
  description: "Dự án này nhằm mục đích phân loại các bình luận của khách hàng về sản phẩm mới ra mắt thành các loại tích cực, tiêu cực hoặc trung tính. Kết quả sẽ được sử dụng để cải thiện sản phẩm và chiến lược marketing.",
  status: "Đang hoạt động",
  annotators: 15,
  progress: 75,
  startDate: "2024-01-15",
  endDate: "2024-04-15",
  budget: 5000,
  dataset: "Dataset A - Customer Reviews",
  labelCategory: "Sentiment Analysis (Positive/Negative)",
};

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/manager/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
              <p className="text-gray-500 mt-1">ID: {projectId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline"><Edit className="h-4 w-4 mr-2"/> Chỉnh sửa</Button>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4 mr-2"/> Xóa</Button>
            <Button variant="secondary"><Archive className="h-4 w-4 mr-2"/> Lưu trữ</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Project Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card variant="glass" className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết dự án</h2>
              <p className="text-gray-600 mb-6">{project.description}</p>
              
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500">Dataset</div>
                    <div className="font-medium text-gray-800">{project.dataset}</div>
                  </div>
                </div>
                 <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500">Số người tham gia</div>
                    <div className="font-medium text-gray-800">{project.annotators} người</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500">Thời gian</div>
                    <div className="font-medium text-gray-800">{project.startDate} - {project.endDate}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500">Ngân sách</div>
                    <div className="font-medium text-gray-800">${project.budget.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </Card>

             {/* Task Progress - Placeholder */}
            <Card variant="glass" className="p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiến độ công việc</h2>
                <p className="text-center text-gray-500 py-8">Biểu đồ và danh sách công việc sẽ được hiển thị ở đây.</p>
            </Card>
          </div>

          {/* Right Column: Status & Actions */}
          <div className="space-y-8">
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái</h3>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
                <Clock className="h-6 w-6" />
                <span>{project.status}</span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">Hoàn thành {project.progress}%</p>
              </div>
              <div className="mt-6 space-y-3">
                <Button fullWidth variant="secondary"><PauseCircle className="h-4 w-4 mr-2"/> Tạm dừng dự án</Button>
                <Button fullWidth variant="secondary"><PlayCircle className="h-4 w-4 mr-2"/> Tiếp tục dự án</Button>
                  <Button fullWidth variant="outline"><CheckCircle className="h-4 w-4 mr-2"/> Đánh dấu hoàn thành</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetailPage;
