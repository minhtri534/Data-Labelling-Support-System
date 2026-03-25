import React, { useEffect, useState } from "react";
<<<<<<< Updated upstream
import { Link, useParams } from "react-router-dom";
import { PlusCircle, Database, Search, AlertCircle, Loader, MoreVertical, UploadCloud } from "lucide-react";
=======
import { Link } from "react-router-dom";
import { PlusCircle, Database, Search, Filter, MoreVertical, UploadCloud, Loader2, FolderOpen } from "lucide-react";
>>>>>>> Stashed changes
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
<<<<<<< Updated upstream
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

=======
import { Badge } from "../../../components/ui/Badge";
import { managerService, type DatasetResponse, type ProjectResponse } from "../../../services/managerService";

const ManagerDatasetListPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Step 1: Get all projects
      const projRes = await managerService.getProjects();
      if (projRes.isSuccess && projRes.data) {
        // Step 2: For each project, get its datasets
        const allDatasets: DatasetResponse[] = [];
        const dsPromises = projRes.data.map(p => managerService.getDatasets(p.id));
        const dsResults = await Promise.all(dsPromises);
        
        dsResults.forEach(res => {
          if (res.isSuccess && res.data) {
            allDatasets.push(...res.data);
          }
        });
        
        setDatasets(allDatasets);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredDatasets = datasets.filter(ds => 
    ds.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

>>>>>>> Stashed changes
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:items-center md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quản lý Bộ dữ liệu (Datasets)</h1>
            <p className="text-gray-500 mt-1">Tổng hợp toàn bộ các tập dữ liệu từ các dự án của bạn.</p>
          </div>
          <div className="flex gap-3">
<<<<<<< Updated upstream
            <Link to={projectId ? `/manager/projects/${projectId}/datasets/upload` : "/manager/datasets/upload"}>
              <Button variant="gradient">
=======
            <Link to="/manager/datasets/upload">
              <Button className="bg-blue-600 hover:bg-blue-700">
>>>>>>> Stashed changes
                <UploadCloud className="h-4 w-4 mr-2" />
                Tải lên dữ liệu mới
              </Button>
            </Link>
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
=======
        <Card className="p-6 border-none shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="w-full max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                className="pl-10 border-gray-200 focus:ring-blue-500" 
                placeholder="Tìm kiếm theo tên dataset..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" className="text-gray-500">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc nâng cao
            </Button>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
              <p className="font-medium">Đang tổng hợp dữ liệu...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs">Dataset</th>
                    <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs">Project ID</th>
                    <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs">Ngày tạo</th>
                    <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredDatasets.map((dataset) => (
                    <tr key={dataset.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Database size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="font-bold text-gray-900">{dataset.name}</div>
                            <div className="text-[10px] text-gray-400 uppercase font-mono">ID: {dataset.id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {dataset.projectId.slice(-8)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(dataset.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/manager/datasets/${dataset.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                              Chi tiết
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="text-gray-400">
                            <MoreVertical size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDatasets.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-gray-400 italic">
                        <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-200" />
                        Không tìm thấy dataset nào.
                      </td>
                    </tr>
                  )}
>>>>>>> Stashed changes
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
