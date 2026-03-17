import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, List, Filter, Search } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

// Mock data for project list
const projects = [
  {
    id: "PROJ-001",
    name: "Phân tích cảm xúc bình luận sản phẩm",
    status: "Đang hoạt động",
    annotators: 15,
    progress: 75,
    startDate: "2024-01-15",
    endDate: "2024-04-15",
  },
  {
    id: "PROJ-002",
    name: "Nhận dạng đối tượng trong ảnh y tế",
    status: "Hoàn thành",
    annotators: 25,
    progress: 100,
    startDate: "2023-11-01",
    endDate: "2024-02-28",
  },
  {
    id: "PROJ-003",
    name: "Trích xuất thực thể từ báo cáo tài chính",
    status: "Tạm dừng",
    annotators: 10,
    progress: 40,
    startDate: "2024-02-01",
    endDate: "2024-05-30",
  },
  {
    id: "PROJ-004",
    name: "Gán nhãn cho xe tự lái",
    status: "Sắp bắt đầu",
    annotators: 30,
    progress: 0,
    startDate: "2024-03-20",
    endDate: "2024-08-20",
  },
];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full inline-block";
  const statusClasses: Record<string, string> = {
    "Đang hoạt động": "bg-blue-100 text-blue-800",
    "Hoàn thành": "bg-green-100 text-green-800",
    "Tạm dừng": "bg-yellow-100 text-yellow-800",
    "Sắp bắt đầu": "bg-gray-100 text-gray-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-200'}`}>{status}</span>;
};

const ManagerProjectListPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quản lý dự án</h1>
            <p className="text-gray-500 mt-1">Xem, tạo và quản lý tất cả các dự án gán nhãn của bạn.</p>
          </div>
          <Link to="/manager/projects/create">
            <Button variant="gradient">
              <PlusCircle className="h-4 w-4 mr-2" />
              Tạo dự án mới
            </Button>
          </Link>
        </div>

        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-full max-w-xs">
              <Input placeholder="Tìm kiếm dự án..." leadingIcon={<Search className="h-5 w-5" />} />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên dự án</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tiến độ</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Số người tham gia</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày bắt đầu</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{project.name}</div>
                      <div className="text-xs text-gray-500">ID: {project.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{project.annotators}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{project.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/manager/projects/${project.id}`} className="text-blue-600 hover:text-blue-800">
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManagerProjectListPage;
