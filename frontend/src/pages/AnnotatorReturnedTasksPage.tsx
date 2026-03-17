import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

interface ReturnedTask {
  id: string;
  project: string;
  feedback: string;
  errorCategory: string;
  returnedAt: string;
}

const MOCK_RETURNED_TASKS: ReturnedTask[] = [
  {
    id: "TASK-1005",
    project: "Vehicle Detection",
    feedback: "Bounding box too loose around object.",
    errorCategory: "Bounding Box Error",
    returnedAt: "1 hour ago"
  }
];

export default function AnnotatorReturnedTasksPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Returned Tasks</h1>

        {MOCK_RETURNED_TASKS.map(task => (
          <Card key={task.id} className="p-5 space-y-3">
            <div>
              <p className="font-semibold">{task.project}</p>
              <p className="text-sm text-gray-500">
                {task.id} • Returned {task.returnedAt}
              </p>
            </div>

            <div className="text-sm">
              <p><strong>Feedback:</strong> {task.feedback}</p>
              <p><strong>Error Category:</strong> {task.errorCategory}</p>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate(`/annotator/rework/${task.id}`)}
            >
              Revise Task
            </Button>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
