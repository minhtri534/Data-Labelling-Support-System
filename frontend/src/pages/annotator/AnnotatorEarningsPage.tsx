import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";

const MOCK_COMPLETED = [
  { id: "TASK-2001", project: "Vehicle Detection", amount: 15, status: "Paid" },
  { id: "TASK-2002", project: "Medical Segmentation", amount: 20, status: "Pending" }
];

export default function AnnotatorEarningsPage() {
  const totalEarned = MOCK_COMPLETED.reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">My Earnings</h1>

        <Card className="p-6 space-y-3">
          <p>Total Earned: <strong>${totalEarned}</strong></p>
        </Card>

        {MOCK_COMPLETED.map(task => (
          <Card key={task.id} className="p-4">
            <p>{task.project}</p>
            <p className="text-sm text-gray-500">
              {task.id} • ${task.amount} • {task.status}
            </p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
