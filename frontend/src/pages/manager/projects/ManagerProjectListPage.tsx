import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { managerService, type ProjectResponse } from "../../../services/managerService";
import { Plus, Folder, Calendar, Loader2, Archive } from "lucide-react";

const ManagerProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await managerService.getProjects();
      if (res.isSuccess) {
        setProjects(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn lưu trữ dự án này không?")) return;
    const res = await managerService.archiveProject(id);
    if (res.isSuccess) {
      alert("Đã lưu trữ dự án thành công.");
      fetchProjects();
    } else {
      alert(res.message || "Lỗi khi lưu trữ dự án.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý dự án</h1>
            <p className="text-gray-500">Xem và điều phối các dự án gán nhãn dữ liệu</p>
          </div>
          <Link to="/manager/projects/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo dự án mới
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p>Đang tải danh sách dự án...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all border-t-4 border-t-blue-600 flex flex-col">
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Folder className="h-6 w-6" />
                    </div>
                    <Badge variant={project.status === 0 ? "success" : "secondary"}>
                      {project.status === 0 ? "Đang hoạt động" : "Đã lưu trữ"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1 h-10">
                      {project.guideline || "Không có hướng dẫn chi tiết."}
                    </p>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ngày tạo: {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t grid grid-cols-2 gap-3">
                  <Link to={`/manager/projects/${project.id}`} className="w-full">
                    <Button variant="outline" className="w-full text-xs">
                      Chi tiết
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-red-500 text-xs"
                    onClick={() => handleArchive(project.id)}
                    disabled={project.status !== 0}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Lưu trữ
                  </Button>
                </div>
              </Card>
            ))}

            {projects.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                <Folder className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có dự án nào. Hãy tạo dự án đầu tiên!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManagerProjectListPage;
