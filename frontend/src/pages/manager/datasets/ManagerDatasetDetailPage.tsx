import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Database, Clock, BarChart, PlusCircle } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { managerService } from "../../../services/managerService";

const ManagerDatasetDetailPage: React.FC = () => {
  const { datasetId } = useParams<{ datasetId: string }>();

  const [dataset, setDataset] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);

  useEffect(() => {
    if (!datasetId) return;

    const fetchData = async () => {
      const datasetRes = await managerService.getDatasetById(datasetId);
      const versionRes = await managerService.getDatasetVersions(datasetId);

      if (datasetRes.isSuccess) setDataset(datasetRes.data);
      if (versionRes.isSuccess) setVersions(versionRes.data);
    };

    fetchData();
  }, [datasetId]);

  const handleDelete = async () => {
    if (!datasetId) return;
    if (!confirm("Are you sure you want to delete this dataset?")) return;

    await managerService.deleteDataset(datasetId);
    window.location.href = "/manager/projects";
  };

  const handleCreateVersion = async () => {
    if (!datasetId) return;

    await managerService.createDatasetVersion({
      datasetId,
      comment: "New version"
    });

    window.location.reload();
  };

  if (!dataset) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/manager/projects" className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{dataset.name}</h1>
              <p className="text-gray-500 mt-1">ID: {datasetId}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Update Metadata
            </Button>

            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Dataset
            </Button>
          </div>
        </div>

        {/* Dataset Info */}
        <Card variant="glass" className="p-8">
          <h2 className="text-xl font-semibold mb-4">Dataset Information</h2>

          <div className="grid grid-cols-2 gap-6 text-sm">

            <div className="flex gap-3">
              <Database className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-gray-500">Type</div>
                <div className="font-medium">{dataset.type || "N/A"}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-gray-500">Created At</div>
                <div className="font-medium">{dataset.createdAt}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <BarChart className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-gray-500">Updated At</div>
                <div className="font-medium">{dataset.updatedAt}</div>
              </div>
            </div>

          </div>
        </Card>

        {/* Versions */}
        <Card variant="glass" className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dataset Versions</h3>

          <div className="space-y-4">
            {versions.map((v) => (
              <div key={v.id} className="p-3 bg-gray-50 rounded-lg border">
                <div className="font-bold">Version {v.versionName || v.id}</div>
                <div className="text-xs text-gray-500">
                  {v.createdAt}
                </div>
                <p className="text-sm mt-1">{v.comment}</p>
              </div>
            ))}
          </div>

          <Button fullWidth variant="outline" className="mt-4" onClick={handleCreateVersion}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Version
          </Button>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default ManagerDatasetDetailPage;