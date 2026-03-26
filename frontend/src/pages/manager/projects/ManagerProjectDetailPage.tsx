import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Archive, Calendar, FileText, Clock, Loader2, Plus, Tag, List
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

  const [newDatasetName, setNewDatasetName] = useState("");
  const [newLabelName, setNewLabelName] = useState("");
  const [isCreatingDataset, setIsCreatingDataset] = useState(false);
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);

  useEffect(() => {
    if (projectId) fetchData();
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
      if (dsRes.isSuccess) setDatasets(dsRes.data || []);
      if (lblRes.isSuccess) setLabels(lblRes.data || []);
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
      fetchData();
    }
    setIsCreatingDataset(false);
  };

  const handleCreateLabel = async () => {
    if (!projectId || !newLabelName) return;
    setIsCreatingLabel(true);
    const res = await managerService.createLabel({ 
      projectId, 
      name: newLabelName, 
      yoloClassId: labels.length
    });
    if (res.isSuccess) {
      setNewLabelName("");
      fetchData();
    }
    setIsCreatingLabel(false);
  };

  const handleArchive = async () => {
    if (!projectId || !confirm("Are you sure you want to archive this project?")) return;
    const res = await managerService.archiveProject(projectId);
    if (res.isSuccess) {
      alert("Project archived.");
      navigate("/manager/projects");
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return "Planned";
      case 1: return "Active";
      case 2: return "Paused";
      case 3: return "Completed";
      default: return "Unknown";
    }
  };

  if (loading && !project) {
    return (
      <DashboardLayout>
        <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p>Loading project details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) return null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">

        {/* Header */}
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Link to="/manager/projects" className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <div className="flex gap-3 items-center">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Badge>{getStatusText(project.status)}</Badge>
              </div>
              <p className="text-gray-500">ID: {project.id}</p>
            </div>
          </div>

          <Button onClick={handleArchive}>
            <Archive className="h-4 w-4 mr-2"/> Archive
          </Button>
        </div>

        {/* Info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Guideline</h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {project.guideline || "No guideline"}
          </p>

          <div className="flex gap-10 mt-6 text-sm">
            <div>Created: {new Date(project.createdAt).toLocaleDateString()}</div>
            <div>Updated: {new Date(project.updatedAt).toLocaleDateString()}</div>
          </div>
        </Card>

        {/* Dataset */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Datasets</h2>

          <div className="flex gap-2 mb-4">
            <Input value={newDatasetName} onChange={e => setNewDatasetName(e.target.value)} />
            <Button onClick={handleCreateDataset}>
              {isCreatingDataset ? <Loader2 className="animate-spin h-4 w-4"/> : <Plus />}
            </Button>
          </div>

          {datasets.map(ds => (
            <div key={ds.id} className="p-3 border rounded mb-2">
              {ds.name}
            </div>
          ))}
        </Card>

        {/* Labels */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Labels</h2>

          <div className="flex gap-2 mb-4">
            <Input value={newLabelName} onChange={e => setNewLabelName(e.target.value)} />
            <Button onClick={handleCreateLabel}>
              {isCreatingLabel ? <Loader2 className="animate-spin h-4 w-4"/> : <Plus />}
            </Button>
          </div>

          {labels.map(l => (
            <div key={l.id} className="p-2 border rounded mb-2">
              {l.name} (Class {l.yoloClassId})
            </div>
          ))}
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default ProjectDetailPage;