import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { List, PlayCircle, CheckCircle, Loader2, Clock } from "lucide-react";
import { annotatorService } from "../../services/annotatorService";
import type { AnnotatorTaskSummary } from "../../types/annotator";

const getStatusBadge = (status: string) => {
  if (status === "Assigned") {
    return <Badge variant="secondary">Assigned</Badge>;
  }

  if (status === "InProgress") {
    return <Badge variant="primary">In Progress</Badge>;
  }

  if (status === "Submitted") {
    return <Badge variant="success">Submitted</Badge>;
  }

  if (status === "Rejected" || status === "Returned") {
    return <Badge variant="danger">Needs Revision</Badge>;
  }

  switch (status) {
    default:
      return <Badge>{status}</Badge>;
  }
};

const AnnotatorTaskListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<AnnotatorTaskSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await annotatorService.getMyTasks();
        if (res.isSuccess) {
          setTasks(res.data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const taskStats = useMemo(
    () => ({
      assigned: tasks.filter((t) => t.status === "Assigned").length,
      inProgress: tasks.filter((t) => t.status === "InProgress").length,
      submitted: tasks.filter((t) => t.status === "Submitted").length,
    }),
    [tasks]
  );

  const handleStart = async (taskId: string) => {
    await annotatorService.startTask(taskId);
    navigate(`/annotator/ai-label/${taskId}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Tasks</h1>
          <p className="text-gray-500 mt-1">List of labeling tasks assigned to you.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-gray-400">
            <p className="text-sm text-gray-500 font-medium">Assigned</p>
            <p className="text-2xl font-bold text-gray-900">{taskStats.assigned}</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-600">
            <p className="text-sm text-gray-500 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-blue-700">{taskStats.inProgress}</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-600">
            <p className="text-sm text-gray-500 font-medium">Submitted</p>
            <p className="text-2xl font-bold text-green-700">{taskStats.submitted}</p>
          </Card>
        </div>

        <Card variant="glass" className="p-6">
          {loading ? (
            <div className="py-14 flex flex-col items-center justify-center text-gray-600 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p>Loading tasks...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.length === 0 && (
                <div className="p-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <List className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">You have no assigned tasks.</p>
                </div>
              )}
              {tasks.map((task) => (
                <Card key={task.id} className="p-5 flex items-center justify-between hover:shadow-md transition-all border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <List className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Task #{task.id.slice(-6)}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold uppercase">Project: {task.projectId.slice(-6)}</span>
                        <span>•</span>
                        <span>Data: {task.dataItemId.slice(-6)}</span>
                      </div>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Assigned at: {task.assignedAt ? new Date(task.assignedAt).toLocaleString('en-US') : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(task.status)}
                    <div className="h-8 w-[1px] bg-gray-100 mx-2" />
                    <Link to={`/annotator/task/${task.id}`}>
                      <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">Details</Button>
                    </Link>
                    {task.status === "Submitted" ? (
                      <Button variant="secondary" disabled className="bg-gray-100 text-gray-400">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={() => handleStart(task.id)} className="bg-blue-600 hover:bg-blue-700">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnnotatorTaskListPage;