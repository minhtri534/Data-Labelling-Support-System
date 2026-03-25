import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Archive, AlertCircle, Loader } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { managerService } from "../../../services/managerService";
import type { ProjectResponse } from "../../../types/manager";

const ManagerProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError("Project ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await managerService.project.getProjectById(projectId);
        if (response.isSuccess && response.data) {
          setProject(response.data);
        } else {
          setError(response.message || "Failed to fetch project");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleDelete = async () => {
    if (!projectId || !window.confirm("Are you sure you want to delete this project?")) return;

    try {
      setDeleting(true);
      const response = await managerService.project.deleteProject(projectId);
      if (response.isSuccess) {
        navigate("/manager/projects");
      } else {
        setError(response.message || "Failed to delete project");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  const handleArchive = async () => {
    if (!projectId) return;

    try {
      const response = await managerService.project.archiveProject(projectId);
      if (response.isSuccess && response.data) {
        setProject(response.data);
      } else {
        setError(response.message || "Failed to archive project");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive project");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <Card variant="glass" className="p-4 bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error || "Project not found"}</span>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const statusMap: Record<number, string> = {
    0: "Sắp bắt đầu",
    1: "Đang hoạt động",
    2: "Tạm dừng",
    3: "Hoàn thành",
    9: "Lưu trữ",
  };

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
            <Link to={`/manager/projects/${projectId}/edit`} className="inline-block">
              <Button variant="outline" disabled={loading}><Edit className="h-4 w-4 mr-2"/> Chỉnh sửa</Button>
            </Link>
            <Button 
              variant="outline" 
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleDelete}
              disabled={deleting || loading}
            >
              <Trash2 className="h-4 w-4 mr-2"/> Xóa
            </Button>
            <Button 
              variant="secondary"
              onClick={handleArchive}
              disabled={loading}
            >
              <Archive className="h-4 w-4 mr-2"/> Lưu trữ
            </Button>
          </div>
        </div>

        {error && (
          <Card variant="glass" className="p-4 bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Project Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card variant="glass" className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết dự án</h2>
              {project.guideline && (
                <p className="text-gray-600 mb-6">{project.guideline}</p>
              )}
              
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-start gap-3">
                  <div>
                    <div className="text-gray-500">Trạng thái</div>
                    <div className="font-medium text-gray-800">{statusMap[project.status]}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div>
                    <div className="text-gray-500">Ngày tạo</div>
                    <div className="font-medium text-gray-800">{new Date(project.createdAt).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Task Progress - Placeholder */}
            <Card variant="glass" className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiến độ công việc</h2>
              <p className="text-center text-gray-500 py-8">Các tab dữ liệu, nhãn, công việc sẽ được hiển thị ở đây.</p>
            </Card>
          </div>

          {/* Right Column: Status & Actions */}
          <div className="space-y-8">
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-gray-500">Trạng thái</div>
                  <div className="font-semibold text-gray-800 mt-1">{statusMap[project.status]}</div>
                </div>
                <div>
                  <div className="text-gray-500">Cập nhật lúc</div>
                  <div className="font-semibold text-gray-800 mt-1">{new Date(project.updatedAt).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6 space-y-3">
              <Link to={`/manager/projects/${projectId}/datasets`} className="block">
                <Button fullWidth variant="secondary">Quản lý Datasets</Button>
              </Link>
              <Link to={`/manager/projects/${projectId}/labels`} className="block">
                <Button fullWidth variant="secondary">Quản lý Nhãn</Button>
              </Link>
              <Link to={`/manager/projects/${projectId}/tasks`} className="block">
                <Button fullWidth variant="secondary">Quản lý Công việc</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerProjectDetailPage;
