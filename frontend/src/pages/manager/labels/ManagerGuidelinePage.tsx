import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Save, FileText, Info, Eye } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";

const ManagerGuidelinePage: React.FC = () => {
  const [content, setContent] = useState(`## Hướng dẫn gán nhãn Sentiment\n1. **Tích cực**: Bình luận thể hiện sự hài lòng, khen ngợi.\n2. **Tiêu cực**: Bình luận thể hiện sự thất vọng, chê bai.\n3. **Trung tính**: Các câu hỏi hoặc bình luận không rõ thái độ.`);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/manager/label-config" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Soạn thảo Guideline</h1>
              <p className="text-gray-500 mt-1">Tạo và chỉnh sửa hướng dẫn chi tiết cho các Annotator.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="gradient"><Eye className="h-4 w-4 mr-2"/> Xem trước</Button>
            <Button variant="gradient"><Save className="h-4 w-4 mr-2"/> Lưu Guideline</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor */}
          <div className="lg:col-span-2">
            <Card variant="glass" className="p-8">
              <Label htmlFor="guideline-content" className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-500" /> Nội dung hướng dẫn (Hỗ trợ Markdown)
              </Label>
              <Textarea 
                id="guideline-content" 
                value={content} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} 
                rows={20} 
                className="font-mono text-sm" 
              />
            </Card>
          </div>

          {/* Metadata & Association */}
          <div className="space-y-8">
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin Guideline</h3>
              <div className="space-y-4">
                <div>
                  <Label>Tên Guideline</Label>
                  <input type="text" defaultValue="Hướng dẫn phân loại cảm xúc" className="w-full h-11 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900" />
                </div>
                <div>
                  <Label>Mô tả ngắn</Label>
                  <textarea rows={3} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900" defaultValue="Guideline cho các dự án phân loại sentiment."></textarea>
                </div>
              </div>
            </Card>
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Áp dụng cho dự án</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-100">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Sentiment Analysis Project</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                  <input type="checkbox" />
                  <span className="text-sm">Tiki Review Project</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerGuidelinePage;
