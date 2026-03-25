import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
<<<<<<< Updated upstream
import { PlusCircle, List, Filter, Search, AlertCircle, Loader } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { managerService } from "../../../services/managerService";
import type { ProjectResponse } from "../../../types/manager";

const StatusBadge: React.FC<{ status: number }> = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full inline-block";
  const statusMap: Record<number, { label: string; classes: string }> = {
    0: { label: "Sắp bắt đầu", classes: "bg-gray-100 text-gray-800" },
    1: { label: "Đang hoạt động", classes: "bg-blue-100 text-blue-800" },
    2: { label: "Tạm dừng", classes: "bg-yellow-100 text-yellow-800" },
    3: { label: "Hoàn thành", classes: "bg-green-100 text-green-800" },
    9: { label: "Lưu trữ", classes: "bg-gray-200 text-gray-700" },
  };
  
  const statusInfo = statusMap[status] || statusMap[0];
  return <span className={`${baseClasses} ${statusInfo.classes}`}>{statusInfo.label}</span>;
};

const ManagerProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await managerService.project.getProjects();
        if (response.isSuccess && response.data) {
          setProjects(response.data);
          setFilteredProjects(response.data);
        } else {
          setError(response.message || "Failed to fetch projects");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle search/filter
  useEffect(() => {
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);
=======
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
>>>>>>> Stashed changes

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
<<<<<<< Updated upstream
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Project Management</h1>
            <p className="text-gray-500 mt-1">View, create, and manage all your labeling projects.</p>
          </div>
          <Link to="/manager/projects/create">
            <Button variant="gradient">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Project
=======
            <h1 className="text-3xl font-bold text-gray-900">Quản lý dự án</h1>
            <p className="text-gray-500">Xem và điều phối các dự án gán nhãn dữ liệu</p>
          </div>
          <Link to="/manager/projects/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo dự án mới
>>>>>>> Stashed changes
            </Button>
          </Link>
        </div>

<<<<<<< Updated upstream
        {error && (
          <Card variant="glass" className="p-4 bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-full max-w-xs">
              <Input 
                placeholder="Tìm kiếm dự án..." 
                leadingIcon={<Search className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
              />
            </div>
=======
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p>Đang tải danh sách dự án...</p>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects available to display</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Project Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Created At</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Updated At</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 max-w-xs truncate">{project.name}</div>
                        <div className="text-xs text-gray-500">ID: {project.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(project.updatedAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/manager/projects/${project.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
=======
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
>>>>>>> Stashed changes
      </div>
    </DashboardLayout>
  );
};

export default ManagerProjectListPage;
