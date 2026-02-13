import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { reviewService, type ReviewTask } from "../services/reviewService";

export default function ReviewQueuePage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await reviewService.getTasks();
      setTasks(data);
      setLoading(false);
    };

    fetchTasks();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Review Queue</h1>

        {loading && <p className="text-gray-500">Loading tasks...</p>}

        {!loading &&
          tasks.map(task => (
            <Card key={task.id} className="p-5 flex justify-between items-center">
              <div>
                <p className="font-semibold">{task.project}</p>
                <p className="text-sm text-gray-500">
                  {task.id} • By {task.annotator} • {task.submittedAt}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate(`/review/${task.id}`)}
              >
                Open
              </Button>
            </Card>
          ))}
      </div>
    </DashboardLayout>
  );
}
