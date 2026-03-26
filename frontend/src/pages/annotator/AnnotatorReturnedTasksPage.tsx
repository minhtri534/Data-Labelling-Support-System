import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { annotatorService } from "../../services/annotatorService";
import { AlertCircle, Clock, ChevronRight, Loader2, MessageSquare, CheckCircle2, Badge } from "lucide-react";

export default function AnnotatorReturnedTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await annotatorService.getMyTasks();
        if (res.isSuccess) {
          const returnedTasks = (res.data || []).filter((t) =>
            ["Returned", "Rejected", "NeedsRevision"].includes(t.status)
          );
          setTasks(returnedTasks);
        }
      } catch (err) {
        console.error("Error loading tasks:", err);
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
          <p className="text-gray-500 font-medium">Loading list...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Returned Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">
              Please review and fix issues reported by the reviewer.
            </p>
          </div>
          {tasks.length > 0 && (
            <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4" />
              {tasks.length} tasks need revision
            </span>
          )}
        </div>

        {/* Task List or Empty State */}
        {tasks.length === 0 ? (
          <Card className="p-16 text-center flex flex-col items-center justify-center border-dashed border-2 bg-white shadow-sm">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Great!</h3>
            <p className="text-gray-500 max-w-sm mt-2">
              You have no tasks to revise right now. Keep up the good work!
            </p>
          </Card>
        ) : (
          <div className="grid gap-5">
            {tasks.map(task => (
              <Card key={task.id} className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-red-500 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-gray-800 tracking-tight">
                      Task #{task.id.slice(-6)}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase font-bold">
                        Project: {task.projectId.slice(-6)}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Updated: {new Date(task.completedAt || task.assignedAt || Date.now()).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="text-[10px] uppercase bg-red-50 text-red-600 border border-red-600">REVISIONS NEEDED</Badge>
                  </div>
                </div>

                {/* Feedback Information */}
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6 flex gap-4">
                  <div className="bg-white p-2 rounded-lg self-start shadow-sm">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Feedback from Reviewer</p>
                    <p className="text-sm text-amber-900 leading-relaxed italic">
                      Details of required fixes and specific reviewer feedback are available on the edit page. Click "Start Fixing" to view details.
                    </p>
                  </div>
                </div>

                {/* Action Area */}
                <div className="flex justify-end items-center border-t border-gray-50 pt-4">
                  <Button
                    onClick={() => navigate(`/annotator/ai-label/${task.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    Start Fixing
                    <ChevronRight className="w-4 h-4 ml-2" />
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