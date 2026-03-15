import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { annotatorService } from "../services/annotatorService";

export default function AnnotatorReturnedTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await annotatorService.getMyTasks();
        if (res.isSuccess) {
          const returnedTasks = res.data.filter((t: any) => 
            t.status === "Returned" || t.status === "Rejected"
          );
          setTasks(returnedTasks);
        }
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">Loading tasks...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Returned Tasks</h1>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
            {tasks.length} Tasks Need Revision
          </span>
        </div>

        {tasks.length === 0 ? (
          <Card className="p-10 text-center text-gray-500">
            No tasks need revision at the moment.
          </Card>
        ) : (
          tasks.map(task => (
            <Card key={task.taskId} className="p-5 space-y-3 border-l-4 border-l-red-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{task.projectName || "Project Name"}</p>
                  <p className="text-sm text-gray-500">
                    ID: {task.taskId} • Updated: {new Date(task.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                   <span className="text-xs font-bold uppercase text-red-500">{task.status}</span>
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded-md">
                <p className="text-sm">
                  <strong className="text-red-700">Reviewer Feedback:</strong> 
                  <span className="ml-2 text-red-600">{task.lastComment || "Please check the bounding boxes again."}</span>
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="gradient"
                  onClick={() => navigate(`/annotator/rework/${task.taskId}`)}
                >
                  Revise & Resubmit
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}