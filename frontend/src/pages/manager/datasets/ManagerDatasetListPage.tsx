import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Database, Search, Filter, MoreVertical, UploadCloud } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

// Mock data for datasets
const datasets = [
  {
    id: "DS-001",
    name: "Dữ liệu ảnh X-quang phổi",
    type: "Image",
    itemsCount: 1500,
    size: "2.5 GB",
    createdAt: "2024-03-10",
    status: "Sẵn sàng",
  },
  {
    id: "DS-002",
    name: "Bình luận sản phẩm Tiki",
    type: "Text",
    itemsCount: 50000,
    size: "150 MB",
    createdAt: "2024-03-12",
    status: "Đang xử lý",
  },
  {
    id: "DS-003",
    name: "Báo cáo tài chính Q1/2024",
    type: "Document",
    itemsCount: 300,
    size: "500 MB",
    createdAt: "2024-03-15",
    status: "Sẵn sàng",
  },
];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full inline-block";
  const statusClasses: Record<string, string> = {
    "Sẵn sàng": "bg-green-100 text-green-800",
    "Đang xử lý": "bg-yellow-100 text-yellow-800",
    "Lỗi": "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-200'}`}>{status}</span>;
};

const ManagerDatasetListPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quản lý Dataset</h1>
            <p className="text-gray-500 mt-1">Xem và quản lý các tập dữ liệu được sử dụng cho các dự án gán nhãn.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/manager/datasets/upload">
              <Button variant="gradient">
                <UploadCloud className="h-4 w-4 mr-2" />
                Tải lên Dataset
              </Button>
            </Link>
          </div>
        </div>

        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-full max-w-xs">
              <Input placeholder="Tìm kiếm dataset..." leadingIcon={<Search className="h-5 w-5" />} />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên Dataset</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Loại</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Số lượng mục</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Kích thước</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {datasets.map((dataset) => (
                  <tr key={dataset.id} className="hover:bg-gray-50">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dataset.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dataset.itemsCount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dataset.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={dataset.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dataset.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/manager/datasets/${dataset.id}`} className="text-blue-600 hover:text-blue-800 mr-4">
                        Chi tiết
                      </Link>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDatasetListPage;
