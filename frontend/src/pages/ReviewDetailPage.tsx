import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { reviewService } from "../services/reviewService";

export default function ReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      const data = await reviewService.getTaskById(id);
      setTask(data);
      setLoading(false);
    };

    fetchTask();
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    await reviewService.approveTask(id);
    navigate("/review");
  };

  const handleReturn = async () => {
    if (!id) return;
    await reviewService.returnTask(id, feedback);
    navigate("/review");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-500 p-6">Loading task...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Review Task {id}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4 space-y-3">
            <h2 className="font-semibold">Labeled Data</h2>
            <img src={task.imageUrl} className="rounded-lg" />
          </Card>

          <Card className="p-4 space-y-3">
            <h2 className="font-semibold">Guideline</h2>
            {task.guideline.map((rule: string, index: number) => (
              <p key={index} className="text-sm text-gray-600">
                - {rule}
              </p>
            ))}
          </Card>
        </div>

        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">Reviewer Feedback</h2>
          <Input
            placeholder="Enter feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Card>

        <div className="flex gap-4">
          <Button variant="gradient" onClick={handleApprove}>
            Approve
          </Button>

          <Button variant="outline" onClick={handleReturn}>
            Return with Feedback
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
