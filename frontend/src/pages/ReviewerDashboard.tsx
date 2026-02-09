import DashboardLayout from '../layouts/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

const STATS = [
  {
    label: 'Pending Review',
    value: '24',
    change: '+4 new',
    trend: 'up',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    label: 'Reviewed Today',
    value: '12',
    change: '85% of goal',
    trend: 'neutral',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    label: 'Accuracy Rate',
    value: '99.2%',
    change: '+0.4% this week',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-brand',
    bg: 'bg-brand/5',
    border: 'border-brand/10',
  },
  {
    label: 'Issues Flagged',
    value: '3',
    change: '-2 from yesterday',
    trend: 'down',
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
];

const RECENT_TASKS = [
  {
    id: 'TASK-2024-001',
    project: 'Vehicle Detection v2',
    annotator: 'Sarah Wilson',
    submitted: '2 hours ago',
    priority: 'High',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=150&q=80',
  },
  {
    id: 'TASK-2024-002',
    project: 'Medical X-Ray Analysis',
    annotator: 'Mike Chen',
    submitted: '3 hours ago',
    priority: 'Medium',
    status: 'In Progress',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=150&q=80',
  },
  {
    id: 'TASK-2024-003',
    project: 'Retail Shelf Audit',
    annotator: 'Alex Thompson',
    submitted: '5 hours ago',
    priority: 'Low',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1604719312566-b7cb966348da?w=150&q=80',
  },
];

export default function ReviewerDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-brand to-palette-violet tracking-tight">
              Reviewer Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Welcome back! You have 24 items pending review.</p>
          </div>
          <Button variant="gradient" className="shadow-lg shadow-brand/20 hover:shadow-brand/30 transition-shadow">
            Start Reviewing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <Card key={stat.label} variant="glass" className="p-5 hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.border} border`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className={`font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tasks List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Review Queue</h2>
              <Button variant="ghost" size="sm" className="text-brand hover:text-brand/80">
                View all
              </Button>
            </div>
            
            <div className="space-y-4">
              {RECENT_TASKS.map((task) => (
                <Card key={task.id} variant="glass" className="p-4 flex items-center gap-4 hover:border-brand/30 transition-all duration-200 group cursor-pointer hover:shadow-md">
                  <div className="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 shadow-inner">
                    <img 
                      src={task.image} 
                      alt="Task thumbnail" 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-brand transition-colors">{task.project}</h3>
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-100' : 
                          task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                          'bg-blue-50 text-blue-700 border-blue-100'}
                      `}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{task.id}</span>
                      <span>•</span>
                      <span>By {task.annotator}</span>
                      <span>•</span>
                      <span>{task.submitted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex hover:border-brand hover:text-brand">
                      Quick View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column (Activity/Notifications) */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Card variant="glass" className="p-0 overflow-hidden">
              <div className="divide-y divide-gray-100/50">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 hover:bg-white/50 transition-colors">
                    <div className="flex gap-3">
                      <div className="h-2 w-2 mt-2 rounded-full bg-brand flex-shrink-0 shadow-[0_0_8px_rgba(var(--brand-rgb),0.5)]" />
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-900">John Doe</span> approved 
                          <span className="font-medium text-gray-900"> Batch #4291</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">20 minutes ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100/50 text-center bg-gray-50/30">
                <Button variant="ghost" size="sm" className="w-full text-xs text-gray-500">
                  View full history
                </Button>
              </div>
            </Card>
            
            {/* Quick Stats/Goals */}
            <Card className="p-6 bg-gradient-to-br from-brand via-blue-600 to-palette-violet text-white border-none shadow-xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -mr-10 -mt-10" />
              
              <div className="relative z-10">
                <h3 className="font-semibold mb-2 text-lg">Weekly Goal</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold tracking-tight">428</span>
                  <span className="text-white/80 text-sm mb-1.5 font-medium">/ 500 reviews</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2.5 mt-2 backdrop-blur-sm border border-white/10">
                  <div className="bg-white h-2.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '85%' }} />
                </div>
                <p className="text-xs text-white/90 mt-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  You're ahead of schedule! Keep it up.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
