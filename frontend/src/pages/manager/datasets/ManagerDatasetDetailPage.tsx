import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Database, FileText, Clock, BarChart, PlusCircle } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

// Mock data for a single dataset
const dataset = {
  id: "DS-001",
  name: "Dữ liệu ảnh X-quang phổi",
  description: "Bộ dữ liệu chứa 1,500 ảnh X-quang ngực để phát hiện các dấu hiệu của viêm phổi. Dữ liệu được thu thập từ nhiều bệnh viện và đã được ẩn danh.",
  type: "Image",
  itemsCount: 1500,
  size: "2.5 GB",
  createdAt: "2024-03-10",
  status: "Sẵn sàng",
  versions: [
    { id: "v1.0", items: 1000, createdAt: "2024-03-10", comment: "Initial upload" },
    { id: "v1.1", items: 1500, createdAt: "2024-03-12", comment: "Added 500 new images" },
  ],
  dataItems: [
    { id: "img_001.png", type: "image/png", size: "1.2 MB" },
    { id: "img_002.png", type: "image/png", size: "1.5 MB" },
    { id: "img_003.png", type: "image/png", size: "1.3 MB" },
  ]
};

const ManagerDatasetDetailPage: React.FC = () => {
  const { datasetId } = useParams<{ datasetId: string }>();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/manager/datasets" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{dataset.name}</h1>
              <p className="text-gray-500 mt-1">ID: {datasetId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline"><Edit className="h-4 w-4 mr-2"/> Cập nhật Metadata</Button>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4 mr-2"/> Xóa Dataset</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Dataset Details & Items */}
          <div className="lg:col-span-2 space-y-8">
            <Card variant="glass" className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin Dataset</h2>
              <p className="text-gray-600 mb-6">{dataset.description}</p>
              
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500">Loại dữ liệu</div>
                    <div className="font-medium text-gray-800">{dataset.type}</div>
                  </div>
                </div>
                 <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500">Số lượng mục</div>
                    <div className="font-medium text-gray-800">{dataset.itemsCount.toLocaleString()} mục</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500">Ngày tạo</div>
                    <div className="font-medium text-gray-800">{dataset.createdAt}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-500">Kích thước</div>
                    <div className="font-medium text-gray-800">{dataset.size}</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Các mục dữ liệu (Data Items)</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead><tr><th className="text-left py-2">Tên tệp</th><th className="text-left py-2">Loại</th><th className="text-left py-2">Kích thước</th></tr></thead>
                    <tbody>
                      {dataset.dataItems.map(item => (
                        <tr key={item.id} className="border-b border-gray-100 text-sm">
                          <td className="py-2 text-gray-800 font-medium">{item.id}</td>
                          <td className="py-2 text-gray-600">{item.type}</td>
                          <td className="py-2 text-gray-600">{item.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </Card>
          </div>

          {/* Right Column: Versions & Actions */}
          <div className="space-y-8">
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quản lý phiên bản</h3>
              <div className="space-y-4">
                {dataset.versions.map(v => (
                  <div key={v.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="font-bold text-gray-800">Phiên bản {v.id}</div>
                    <div className="text-xs text-gray-500">{v.createdAt} - {v.items} mục</div>
                    <p className="text-sm text-gray-700 mt-1">{v.comment}</p>
                  </div>
                ))}
              </div>
              <Button fullWidth variant="outline" className="mt-4"><PlusCircle className="h-4 w-4 mr-2"/> Tạo phiên bản mới</Button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDatasetDetailPage;
