import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { List, PlayCircle, CheckCircle, Loader2 } from "lucide-react";
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
    return <Badge variant="danger">Needs Rework</Badge>;
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
          <Card className="p-4">
            <p className="text-sm text-gray-500">Assigned</p>
            <p className="text-2xl font-bold text-gray-900">{taskStats.assigned}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-blue-700">{taskStats.inProgress}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Submitted</p>
            <p className="text-2xl font-bold text-green-700">{taskStats.submitted}</p>
          </Card>
        </div>

        <Card variant="glass" className="p-6">
          {loading ? (
            <div className="py-14 flex items-center justify-center text-gray-600 gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading tasks...
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.length === 0 && (
                <Card className="p-8 text-center text-gray-500 border-dashed">No tasks have been assigned to you yet.</Card>
              )}
              {tasks.map((task) => (
                <Card key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-md">
                      <List className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Task {task.id.slice(-6)}</h3>
                      <p className="text-sm text-gray-500">Project: {task.projectId} | DataItem: {task.dataItemId}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Assigned: {task.assignedAt ? new Date(task.assignedAt).toLocaleString() : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(task.status)}
                    <Link to={`/annotator/task/${task.id}`}>
                      <Button variant="outline">Details</Button>
                    </Link>
                    {task.status === "Submitted" ? (
                      <Button variant="secondary" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submitted
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={() => handleStart(task.id)}>
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