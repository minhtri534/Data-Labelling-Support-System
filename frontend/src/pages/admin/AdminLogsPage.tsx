import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { adminService, type AdminActivityLogResponse } from "../../services/adminService";
import { Search, Download, Filter, Loader2, User, Activity, Clock } from "lucide-react";

const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminActivityLogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getActivityLogs(page, 50);
      if (res.isSuccess) {
        setLogs(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const handleExport = async () => {
    try {
      const blob = await adminService.exportActivityLogs("csv");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nhat-ky-he-thong-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      alert("Đã tải xuống nhật ký hệ thống.");
    } catch (error) {
      alert("Lỗi khi xuất nhật ký.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Nhật ký hoạt động</h1>
            <p className="text-gray-500">Theo dõi toàn bộ các thao tác quản trị và hệ thống</p>
          </div>
          <Button onClick={handleExport} variant="outline" className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
            <Download size={18} />
            Xuất file CSV
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <Input 
              className="pl-10 border-gray-200 focus:ring-blue-500" 
              placeholder="Lọc theo email người dùng, hành động hoặc thực thể..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" className="text-gray-500">
            <Filter size={18} className="mr-2" />
            Bộ lọc nâng cao
          </Button>
        </div>

        <Card className="overflow-hidden border-gray-100 shadow-sm">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p>Đang tải nhật ký...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase text-xs">Hành động</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase text-xs">Người thực hiện</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase text-xs">Thực thể</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase text-xs">Chi tiết</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase text-xs">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Activity size={14} className="text-blue-500" />
                          <span className="font-semibold text-gray-900">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          {log.userEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          {log.entityName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-xs truncate italic">
                        {log.details}
                      </td>
                      <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs">
                          <Clock size={12} />
                          {new Date(log.timestamp).toLocaleString('vi-VN')}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                        Không tìm thấy nhật ký hoạt động nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        
        <div className="flex justify-center items-center gap-4 pt-4">
          <Button 
            variant="outline" 
            size="sm"
            disabled={page === 1 || loading} 
            onClick={() => setPage(p => p - 1)}
            className="text-xs"
          >
            Trang trước
          </Button>
          <span className="text-sm text-gray-500 font-medium">Trang {page}</span>
          <Button 
            variant="outline" 
            size="sm"
            disabled={logs.length < 50 || loading}
            onClick={() => setPage(p => p + 1)}
            className="text-xs"
          >
            Trang sau
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminLogsPage;
