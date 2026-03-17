import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, PlusCircle, Users, ListTodo, Percent, Calendar, Search } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

// Mock data
const projects = [
  { id: "PROJ-001", name: "Phân tích cảm xúc bình luận sản phẩm" },
  { id: "PROJ-003", name: "Trích xuất thực thể từ báo cáo tài chính" },
];

const annotators = [
  { id: "user-01", name: "Nguyễn Văn A", avatar: "/avatars/01.png" },
  { id: "user-02", name: "Trần Thị B", avatar: "/avatars/02.png" },
  { id: "user-03", name: "Lê Văn C", avatar: "/avatars/03.png" },
  { id: "user-04", name: "Phạm Thị D", avatar: "/avatars/04.png" },
];

const ManagerCreateTaskPage: React.FC = () => {
  const [selectedAnnotators, setSelectedAnnotators] = useState<string[]>([]);

  const toggleAnnotator = (id: string) => {
    setSelectedAnnotators(prev => 
      prev.includes(id) ? prev.filter(aId => aId !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/manager/projects/PROJ-001" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tạo công việc (Task) mới</h1>
            <p className="text-gray-500 mt-1">Chia nhỏ dữ liệu và giao việc cho đội ngũ của bạn.</p>
          </div>
        </div>

        <form>
          <Card variant="glass" className="p-8 space-y-8">
            {/* Section 1: Chọn dự án và dữ liệu */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="project">Dự án</Label>
                <select id="project" required className="w-full h-11 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900">
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Chọn dữ liệu cần gán nhãn</Label>
                <div className="p-4 border rounded-lg bg-gray-50 text-sm text-gray-600">
                  <p>Chức năng chọn dữ liệu (toàn bộ, một phần, hoặc theo bộ lọc) sẽ được tích hợp ở đây. Hiện tại, mặc định sẽ lấy 100 mục dữ liệu chưa được gán.</p>
                </div>
              </div>
            </div>

            {/* Section 2: Giao việc */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-blue-500"/>Giao cho Annotator</h3>
              <div className="p-4 border rounded-lg">
                <div className="mb-4">
                    <Input placeholder="Tìm kiếm annotator..." leadingIcon={<Search className="h-5 w-5" />} />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {annotators.map(user => (
                    <div key={user.id} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${selectedAnnotators.includes(user.id) ? 'bg-blue-50 border-blue-200 border' : 'hover:bg-gray-50'}`} onClick={() => toggleAnnotator(user.id)}>
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                      <input type="checkbox" checked={selectedAnnotators.includes(user.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" readOnly />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Cấu hình */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><ListTodo className="h-5 w-5 text-blue-500"/>Cấu hình công việc</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="deadline">Hạn chót</Label>
                  <Input id="deadline" type="date" required />
                </div>
                <div>
                  <Label htmlFor="reviewPercentage">Tỷ lệ review (%)</Label>
                  <Input id="reviewPercentage" type="number" defaultValue={20} placeholder="Ví dụ: 20" leadingIcon={<Percent className="h-5 w-5" />} />
                  <p className="text-xs text-gray-500 mt-1">Phần trăm số lượng mục sẽ được review ngẫu nhiên.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end gap-4">
              <Link to="/manager/projects/PROJ-001">
                <Button type="button" variant="ghost">Hủy bỏ</Button>
              </Link>
              <Button type="submit" variant="gradient">
                <PlusCircle className="h-4 w-4 mr-2" />
                Tạo và giao việc
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ManagerCreateTaskPage;
