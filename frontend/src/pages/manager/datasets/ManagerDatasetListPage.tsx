import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PlusCircle, Database, Search, AlertCircle, Loader, MoreVertical, UploadCloud } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { managerService } from "../../../services/managerService";
import type { DatasetResponse } from "../../../types/manager";

const ManagerDatasetListPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [datasets, setDatasets] = useState<DatasetResponse[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<DatasetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDatasets = async () => {
      if (!projectId) {
        setError("Project ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await managerService.dataset.getDatasets(projectId);
        if (response.isSuccess && response.data) {
          setDatasets(response.data);
          setFilteredDatasets(response.data);
        } else {
          setError(response.message || "Failed to fetch datasets");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch datasets");
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, [projectId]);

  useEffect(() => {
    const filtered = datasets.filter(dataset =>
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDatasets(filtered);
  }, [searchTerm, datasets]);

  const handleDeleteDataset = async (datasetId: string, datasetName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${datasetName}"?`)) return;

    try {
      const response = await managerService.dataset.deleteDataset(datasetId);
      if (response.isSuccess) {
        setDatasets(prev => prev.filter(d => d.id !== datasetId));
      } else {
        alert(response.message || "Failed to delete dataset");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete dataset");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quản lý Dataset</h1>
            <p className="text-gray-500 mt-1">Xem và quản lý các tập dữ liệu được sử dụng cho các dự án gán nhãn.</p>
          </div>
          <div className="flex gap-3">
            <Link to={projectId ? `/manager/projects/${projectId}/datasets/upload` : "/manager/datasets/upload"}>
              <Button variant="gradient">
                <UploadCloud className="h-4 w-4 mr-2" />
                Tải lên Dataset
              </Button>
            </Link>
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

        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-full max-w-xs">
              <Input 
                placeholder="Tìm kiếm dataset..." 
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
          ) : filteredDatasets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Không có dataset nào để hiển thị</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên Dataset</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Số lượng mục</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày cập nhật</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDatasets.map((dataset) => (
                    <tr key={dataset.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Database className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{dataset.name}</div>
                            <div className="text-xs text-gray-500">ID: {dataset.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dataset.totalItems.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(dataset.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(dataset.updatedAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Link to={`/manager/datasets/${dataset.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                          Chi tiết
                        </Link>
                        <button 
                          onClick={() => handleDeleteDataset(dataset.id, dataset.name)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
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

export default ManagerDatasetListPage;
