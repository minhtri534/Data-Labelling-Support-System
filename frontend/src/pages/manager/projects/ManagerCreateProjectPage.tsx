import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, PlusCircle, FileText, Users, Calendar, DollarSign, Tag, Settings } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";

const ManagerCreateProjectPage: React.FC = () => {
  // Mock data - sẽ thay thế bằng API call sau này
  const [datasets, setDatasets] = useState([
    { id: 'ds-001', name: 'Dataset A - Customer Reviews' },
    { id: 'ds-002', name: 'Dataset B - Medical Images' },
    { id: 'ds-003', name: 'Dataset C - Financial Reports' },
  ]);

  const [labelCategories, setLabelCategories] = useState([
    { id: 'lc-01', name: 'Sentiment Analysis (Positive/Negative)' },
    { id: 'lc-02', name: 'Image Classification (Tumor/Normal)' },
    { id: 'lc-03', name: 'Named Entity Recognition (Finance)' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic tạo dự án sẽ được thêm ở đây
    alert("Project creation logic goes here!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/manager/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Tạo dự án mới
            </h1>
            <p className="text-gray-500 mt-1">Điền thông tin chi tiết để khởi tạo một dự án gán nhãn mới.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card variant="glass" className="p-8 space-y-8">
            {/* Section 1: Thông tin cơ bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="projectName">Tên dự án</Label>
                  <Input id="projectName" required placeholder="Ví dụ: Phân tích cảm xúc bình luận sản phẩm" leadingIcon={<FileText className="h-5 w-5" />} />
                </div>
                <div>
                  <Label htmlFor="description">Mô tả dự án</Label>
                  <Textarea id="description" placeholder="Mô tả mục tiêu, yêu cầu và kết quả mong đợi của dự án." rows={5} />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="dataset">Chọn Dataset</Label>
                  <select id="dataset" required className="w-full h-11 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                    <option value="" disabled selected>-- Chọn một dataset --</option>
                    {datasets.map(ds => <option key={ds.id} value={ds.id}>{ds.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="labelCategory">Chọn bộ nhãn & quy tắc</Label>
                  <select id="labelCategory" required className="w-full h-11 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                    <option value="" disabled selected>-- Chọn một bộ nhãn --</option>
                    {labelCategories.map(lc => <option key={lc.id} value={lc.id}>{lc.name}</option>)}
                  </select>
                </div>
                 <div>
                  <Label htmlFor="budget">Ngân sách dự kiến (USD)</Label>
                  <Input id="budget" type="number" placeholder="1000" leadingIcon={<DollarSign className="h-5 w-5" />} />
                </div>
              </div>
            </div>

            {/* Section 2: Thời gian */}
            <div className="pt-8 border-t border-gray-200">
               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-500"/>Thời gian thực hiện</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input id="startDate" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input id="endDate" type="date" required />
                  </div>
               </div>
            </div>

            <div className="pt-8 flex justify-end gap-4">
              <Link to="/manager/projects">
                <Button type="button" variant="ghost">Hủy bỏ</Button>
              </Link>
              <Button type="submit" variant="gradient">
                <PlusCircle className="h-4 w-4 mr-2" />
                Tạo dự án
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ManagerCreateProjectPage;
