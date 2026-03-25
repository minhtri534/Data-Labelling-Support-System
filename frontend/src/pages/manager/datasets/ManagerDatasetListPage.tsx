import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Database, Search, Filter, MoreVertical, UploadCloud, Loader2, FolderOpen } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
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

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:items-center md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quản lý Bộ dữ liệu (Datasets)</h1>
            <p className="text-gray-500 mt-1">Tổng hợp toàn bộ các tập dữ liệu từ các dự án của bạn.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/manager/datasets/upload">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UploadCloud className="h-4 w-4 mr-2" />
                Tải lên dữ liệu mới
              </Button>
            </Link>
          </div>
        </div>

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
