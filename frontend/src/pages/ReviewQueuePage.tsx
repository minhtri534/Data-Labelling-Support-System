import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const MOCK_TASKS = [
  {
    id: "TASK-1001",
    project: "Vehicle Detection",
    annotator: "Alice",
    submittedAt: "2 hours ago",
    status: "Pending"
  },
  {
    id: "TASK-1002",
    project: "Medical Segmentation",
    annotator: "Bob",
    submittedAt: "3 hours ago",
    status: "Pending"
  }
];

export default function ReviewQueuePage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Review Queue</h1>

        {MOCK_TASKS.map(task => (
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
