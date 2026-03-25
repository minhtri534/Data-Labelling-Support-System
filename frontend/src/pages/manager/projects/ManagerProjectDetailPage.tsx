import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
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
=======
import { 
  ArrowLeft, Edit, Trash2, Archive, PlayCircle, PauseCircle, Users, 
  Calendar, FileText, CheckCircle, Clock, Loader2, Plus, Upload, Tag, List
} from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Input } from "../../../components/ui/Input";
import { managerService, type ProjectResponse, type DatasetResponse, type ManagerLabelResponse } from "../../../services/managerService";

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [datasets, setDatasets] = useState<DatasetResponse[]>([]);
  const [labels, setLabels] = useState<ManagerLabelResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for creating new items
  const [newDatasetName, setNewDatasetName] = useState("");
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3b82f6");
  const [isCreatingDataset, setIsCreatingDataset] = useState(false);
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [projRes, dsRes, lblRes] = await Promise.all([
        managerService.getProjectById(projectId),
        managerService.getDatasets(projectId),
        managerService.getLabels(projectId)
      ]);

      if (projRes.isSuccess) setProject(projRes.data);
      if (dsRes.isSuccess) setDatasets(res => dsRes.data || []);
      if (lblRes.isSuccess) setLabels(res => lblRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDataset = async () => {
    if (!projectId || !newDatasetName) return;
    setIsCreatingDataset(true);
    const res = await managerService.createDataset({ projectId, name: newDatasetName });
    if (res.isSuccess) {
      setNewDatasetName("");
      const dsRes = await managerService.getDatasets(projectId);
      if (dsRes.isSuccess) setDatasets(dsRes.data);
    }
    setIsCreatingDataset(false);
  };

  const handleCreateLabel = async () => {
    if (!projectId || !newLabelName) return;
    setIsCreatingLabel(true);
    const res = await managerService.createLabel({ 
      projectId, 
      name: newLabelName, 
      yoloClassId: labels.length // Auto-increment class ID
    });
    if (res.isSuccess) {
      setNewLabelName("");
      const lblRes = await managerService.getLabels(projectId);
      if (lblRes.isSuccess) setLabels(lblRes.data);
    }
    setIsCreatingLabel(false);
  };

  const handleArchive = async () => {
    if (!projectId || !confirm("Bạn có chắc muốn lưu trữ dự án này?")) return;
    const res = await managerService.archiveProject(projectId);
    if (res.isSuccess) {
      alert("Đã lưu trữ dự án.");
      navigate("/manager/projects");
    }
  };

  if (loading && !project) {
    return (
      <DashboardLayout>
        <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p>Đang tải thông tin dự án...</p>
>>>>>>> Stashed changes
        </div>
      </DashboardLayout>
    );
  }

<<<<<<< Updated upstream
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
=======
  if (!project) return null;
>>>>>>> Stashed changes

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/manager/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
                <Badge variant={project.status === 0 ? "success" : "secondary"}>
                  {project.status === 0 ? "Active" : "Archived"}
                </Badge>
              </div>
              <p className="text-gray-500 mt-1">ID: {project.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
<<<<<<< Updated upstream
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
=======
            <Button variant="outline"><Edit className="h-4 w-4 mr-2"/> Sửa</Button>
            <Button variant="secondary" onClick={handleArchive} disabled={project.status !== 0}>
>>>>>>> Stashed changes
              <Archive className="h-4 w-4 mr-2"/> Lưu trữ
            </Button>
          </div>
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

        {/* Main Content */}
=======
        {/* Main Content Grid */}
>>>>>>> Stashed changes
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns: Details & Management */}
          <div className="lg:col-span-2 space-y-8">
<<<<<<< Updated upstream
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
=======
            
            {/* Project Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="text-blue-600 h-5 w-5" />
                Hướng dẫn & Mô tả
              </h2>
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-gray-700 whitespace-pre-wrap italic">
                {project.guideline || "Chưa có hướng dẫn dán nhãn cụ thể cho dự án này."}
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-gray-500">Ngày tạo</div>
                    <div className="font-semibold">{new Date(project.createdAt).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-gray-500">Cập nhật cuối</div>
                    <div className="font-semibold">{new Date(project.updatedAt).toLocaleDateString('vi-VN')}</div>
>>>>>>> Stashed changes
                  </div>
                </div>
              </div>
            </Card>

<<<<<<< Updated upstream
            {/* Task Progress - Placeholder */}
            <Card variant="glass" className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiến độ công việc</h2>
              <p className="text-center text-gray-500 py-8">Các tab dữ liệu, nhãn, công việc sẽ được hiển thị ở đây.</p>
=======
            {/* Dataset Management */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <List className="text-blue-600 h-5 w-5" />
                  Danh sách Dataset
                </h2>
              </div>

              <div className="space-y-4">
                {/* Create Dataset Form */}
                <div className="flex gap-2">
                  <Input 
                    placeholder="Tên Dataset mới..." 
                    value={newDatasetName}
                    onChange={(e) => setNewDatasetName(e.target.value)}
                  />
                  <Button onClick={handleCreateDataset} disabled={isCreatingDataset || !newDatasetName}>
                    {isCreatingDataset ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4 mr-1" />}
                    Tạo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {datasets.map(ds => (
                    <div key={ds.id} className="p-4 border rounded-xl hover:border-blue-300 transition-colors flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded text-gray-600">
                          <FolderClosed className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{ds.name}</p>
                          <p className="text-xs text-gray-400">ID: {ds.id.slice(-6)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        <Upload size={16} />
                      </Button>
                    </div>
                  ))}
                  {datasets.length === 0 && (
                    <p className="col-span-full text-center text-gray-400 py-4 italic">Chưa có dataset nào.</p>
                  )}
                </div>
              </div>
>>>>>>> Stashed changes
            </Card>
          </div>

          {/* Right Column: Labels & Monitoring */}
          <div className="space-y-8">
<<<<<<< Updated upstream
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
=======
            
            {/* Label Management */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="text-blue-600 h-5 w-5" />
                Nhãn dự án
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Tên nhãn..." 
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                  />
                  <Button variant="outline" size="sm" onClick={handleCreateLabel} disabled={isCreatingLabel || !newLabelName}>
                    {isCreatingLabel ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus size={16} />}
                  </Button>
                </div>

                <div className="space-y-2 mt-4">
                  {labels.map(lbl => (
                    <div key={lbl.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">{lbl.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">Class ID: {lbl.yoloClassId}</span>
                    </div>
                  ))}
                  {labels.length === 0 && <p className="text-center text-gray-400 text-sm italic">Chưa có nhãn nào.</p>}
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-gray-900 text-white">
              <h3 className="text-lg font-bold mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <Button fullWidth className="bg-blue-600 hover:bg-blue-700 border-none">
                  <Users className="h-4 w-4 mr-2" />
                  Gán Task cho Annotator
                </Button>
                <Button fullWidth variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Kiểm tra chất lượng
                </Button>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
export default ManagerProjectDetailPage;
=======
// Internal icon for consistency
const FolderClosed = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
);

export default ProjectDetailPage;
>>>>>>> Stashed changes
