import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Tag, Edit2, Trash2, Settings, HelpCircle, Save } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

// Mock data cho danh mục nhãn
const initialCategories = [
  { id: "LC-01", name: "Sentiment", labels: ["Tích cực", "Tiêu cực", "Trung tính"], type: "Classification" },
  { id: "LC-02", name: "Animal Species", labels: ["Chó", "Mèo", "Chim", "Cá"], type: "Object Detection" },
];

const ManagerLabelManagementPage: React.FC = () => {
  const [categories, setCategories] = useState(initialCategories);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/manager/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cấu hình Nhãn</h1>
              <p className="text-gray-500 mt-1">Định nghĩa các loại nhãn và quy tắc cho dự án của bạn.</p>
            </div>
          </div>
          <Button variant="gradient">
            <Plus className="h-4 w-4 mr-2" />
            Thêm danh mục mới
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Danh sách danh mục bên trái */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-semibold text-gray-700 uppercase text-xs tracking-wider">Danh mục hiện có</h3>
            {categories.map(cat => (
              <Card key={cat.id} className="p-4 cursor-pointer hover:border-blue-500 border-2 border-transparent transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-900">{cat.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{cat.type}</div>
                  </div>
                  <Tag className="h-4 w-4 text-blue-500" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {cat.labels.slice(0, 3).map(l => (
                    <span key={l} className="px-2 py-0.5 bg-gray-100 text-[10px] rounded text-gray-600">{l}</span>
                  ))}
                  {cat.labels.length > 3 && <span className="text-[10px] text-gray-400">+{cat.labels.length - 3}</span>}
                </div>
              </Card>
            ))}
          </div>

          {/* Chi tiết chỉnh sửa bên phải */}
          <div className="md:col-span-2">
            <Card variant="glass" className="p-8 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa danh mục: Sentiment</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Tên danh mục</Label>
                  <Input defaultValue="Sentiment" />
                </div>
                <div>
                  <Label>Kiểu gán nhãn (Annotation Type)</Label>
                  <select className="w-full h-11 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                    <option value="Classification">Phân loại (Classification)</option>
                    <option value="BoundingBox">Bao khung (Bounding Box)</option>
                    <option value="Polygon">Vùng đa giác (Polygon)</option>
                    <option value="NER">Thực thể (NER)</option>
                  </select>
                </div>
                
                <div>
                  <Label className="flex justify-between items-center">
                    Danh sách các nhãn
                    <Button variant="ghost" size="sm" className="text-blue-600 h-auto py-1 px-2"><Plus className="h-3 w-3 mr-1"/> Thêm nhãn</Button>
                  </Label>
                  <div className="space-y-2 mt-2">
                    {["Tích cực", "Tiêu cực", "Trung tính"].map((l, i) => (
                      <div key={i} className="flex gap-2">
                        <Input defaultValue={l} className="flex-1" />
                        <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="h-4 w-4"/></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button variant="gradient">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerLabelManagementPage;
