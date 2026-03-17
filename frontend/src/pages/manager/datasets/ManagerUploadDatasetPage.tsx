import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UploadCloud, File, BarChart, X } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";

const ManagerUploadDatasetPage: React.FC = () => {
  // Mock state for file upload
  const [files, setFiles] = React.useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Vui lòng chọn tệp để tải lên.");
      return;
    }
    // Logic tải lên sẽ được xử lý ở đây
    alert(`Đang tải lên ${files.length} tệp...`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/manager/datasets" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tải lên Dataset mới</h1>
            <p className="text-gray-500 mt-1">Thêm dữ liệu mới vào hệ thống để chuẩn bị cho việc gán nhãn.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card variant="glass" className="p-8 space-y-8">
            {/* Thông tin Dataset */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="datasetName">Tên Dataset</Label>
                <Input id="datasetName" required placeholder="Ví dụ: Dữ liệu ảnh X-quang phổi" />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea id="description" placeholder="Mô tả nguồn gốc, loại dữ liệu và mục đích sử dụng." rows={4} />
              </div>
            </div>

            {/* Vùng tải tệp */}
            <div className="pt-8 border-t border-gray-200">
              <Label className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UploadCloud className="h-6 w-6 text-blue-500" /> Tải tệp lên
              </Label>
              <div className="mt-4 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Chọn tệp để tải lên</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">hoặc kéo và thả vào đây</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">Hỗ trợ PNG, JPG, GIF, CSV, JSON lên đến 10MB</p>
                </div>
              </div>
              
              {/* Danh sách tệp đã chọn */}
              {files.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700">Tệp đã chọn:</h4>
                  <ul className="mt-2 space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-md">
                        <span className="text-gray-800 truncate">{file.name}</span>
                        <span className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-8 flex justify-end gap-4">
              <Link to="/manager/datasets">
                <Button type="button" variant="ghost">Hủy bỏ</Button>
              </Link>
              <Button type="submit" variant="gradient">
                <UploadCloud className="h-4 w-4 mr-2" />
                Bắt đầu tải lên
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ManagerUploadDatasetPage;
