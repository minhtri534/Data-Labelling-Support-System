import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { annotatorService } from "../../services/annotatorService";
import { AlertCircle, Clock, ChevronRight, Loader2, MessageSquare, CheckCircle2 } from "lucide-react";

export default function AnnotatorReturnedTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await annotatorService.getMyTasks();
        if (res.isSuccess) {
          // Lọc các task bị Rejected (3) hoặc các trạng thái cần sửa lại
          const returnedTasks = res.data.filter((t: any) => 
            t.status === 3 || t.status === "Returned" || t.status === "Rejected"
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
        <div className="flex flex-col justify-center items-center h-96 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Loading your tasks...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Returned Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">
              Please review and fix the issues reported by the reviewers.
            </p>
          </div>
          {tasks.length > 0 && (
            <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4" />
              {tasks.length} Revision{tasks.length > 1 ? 's' : ''} Required
            </span>
          )}
        </div>

        {/* Task List or Empty State */}
        {tasks.length === 0 ? (
          <Card className="p-16 text-center flex flex-col items-center justify-center border-dashed border-2 bg-gray-50/50">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 max-w-sm mt-2">
              You don't have any tasks that need revision at the moment. New tasks will appear here if they are returned by reviewers.
            </p>
          </Card>
        ) : (
          <div className="grid gap-5">
            {tasks.map(task => (
              <Card key={task.id} className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-red-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-gray-800 tracking-tight">
                      {task.name || "Untitled Task"}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        ID: {task.id}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Last updated: {new Date(task.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-red-600 text-white rounded shadow-sm">
                      {task.status === 3 ? "REJECTED" : "RETURNED"}
                    </span>
                  </div>
                </div>

                {/* Feedback Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 flex gap-4">
                  <div className="bg-amber-100 p-2 rounded-lg self-start">
                    <MessageSquare className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Reviewer Feedback</p>
                    <p className="text-sm text-amber-900 leading-relaxed italic">
                      "{task.lastComment || "No specific comment provided. Please double-check the accuracy of all bounding boxes and labels."}"
                    </p>
                  </div>
                </div>

                {/* Action Area */}
                <div className="flex justify-end items-center border-t pt-4">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="group px-8"
                    onClick={() => navigate(`/annotator/ai-label/${task.id}`)}
                  >
                    Start Revision
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}