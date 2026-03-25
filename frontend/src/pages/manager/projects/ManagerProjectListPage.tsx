import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Project Management</h1>
            <p className="text-gray-500 mt-1">View, create, and manage all your labeling projects.</p>
          </div>
          <Link to="/manager/projects/create">
            <Button variant="gradient">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
          </Link>
        </div>

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
          </div>

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
      </div>
    </DashboardLayout>
  );
};

export default ManagerProjectListPage;
