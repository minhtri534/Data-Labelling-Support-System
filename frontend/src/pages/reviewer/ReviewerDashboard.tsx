import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  Loader2,
  ClipboardCheck,
  Badge
} from 'lucide-react';
import { reviewerService, type ReviewerSubmittedTaskResponse } from '../../services/reviewerService';

export default function ReviewerDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ReviewerSubmittedTaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    reviewedToday: 0,
    accuracy: 98.5,
    issues: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await reviewerService.getSubmittedTasks();
        if (res.isSuccess) {
          const submittedTasks = res.data || [];
          setTasks(submittedTasks);
          setStats(prev => ({
            ...prev,
            pending: submittedTasks.length,
            issues: submittedTasks.filter(t => t.status === 'Returned').length
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: 'Chờ kiểm duyệt',
      value: stats.pending.toString(),
      change: 'Cập nhật mới',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'Đã duyệt hôm nay',
      value: stats.reviewedToday.toString(),
      change: '85% mục tiêu',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Tỷ lệ chính xác',
      value: `${stats.accuracy}%`,
      change: '+0.4% tuần này',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Yêu cầu sửa lại',
      value: stats.issues.toString(),
      change: 'Đang xử lý',
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Bảng điều khiển Reviewer
            </h1>
            <p className="text-gray-500 mt-1">Chào mừng quay trở lại! Bạn có {stats.pending} công việc đang chờ kiểm duyệt.</p>
          </div>
          <Button onClick={() => navigate('/review')} className="bg-blue-600 hover:bg-blue-700 shadow-lg transition-all">
            Bắt đầu Review ngay
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-5 hover:shadow-md transition-all border-none shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.border} border`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-400 font-medium">
                {stat.change}
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tasks List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Hàng đợi gần đây</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/review')} className="text-blue-600 hover:bg-blue-50">
                Xem tất cả
              </Button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : tasks.length === 0 ? (
                <Card className="p-12 text-center border-dashed flex flex-col items-center gap-3">
                  <ClipboardCheck className="h-12 w-12 text-gray-200" />
                  <p className="text-gray-500 font-medium">Hiện không có tác vụ nào cần kiểm duyệt.</p>
                </Card>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <Card key={task.id} className="p-4 flex items-center gap-4 hover:border-blue-300 transition-all group cursor-pointer shadow-sm border-gray-100" onClick={() => navigate(`/review/${task.id}`)}>
                    <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <ClipboardCheck size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{task.projectName}</h3>
                        <Badge className="text-[10px] uppercase bg-blue-50 text-blue-600 border border-blue-600">Mới nộp</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">ID: {task.id.slice(-6)}</span>
                        <span>•</span>
                        <span className="font-medium text-gray-700">Bởi: {task.annotatorName}</span>
                        <span>•</span>
                        <span>{new Date(task.submittedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                      Xem chi tiết
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Thông báo</h2>
            <Card className="p-0 overflow-hidden shadow-sm border-gray-100">
              <div className="divide-y divide-gray-50">
                {tasks.length > 0 ? (
                  tasks.slice(0, 4).map((t, i) => (
                    <div key={i} className="p-4 hover:bg-blue-50/30 transition-colors">
                      <div className="flex gap-3">
                        <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-bold text-gray-900">{t.annotatorName}</span> vừa nộp bài cho dự án 
                            <span className="font-bold text-gray-900"> {t.projectName}</span>
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                            {new Date(t.submittedAt).toLocaleTimeString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm italic">
                    Không có thông báo mới.
                  </div>
                )}
              </div>
            </Card>
            
            {/* Weekly Goal */}
            <Card className="p-6 bg-gray-900 text-white border-none shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-10 -mt-10" />
              <div className="relative z-10">
                <h3 className="font-bold mb-2 text-lg">Mục tiêu tuần</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold tracking-tight">428</span>
                  <span className="text-gray-400 text-sm mb-1.5 font-medium">/ 500 tasks</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Bạn đang hoàn thành rất tốt kế hoạch!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
