import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function ReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"pending" | "approved" | "returned">("pending");

  const detectInconsistency = () => {
    alert("System detected 2 inconsistent labels.");
  };

  const handleApprove = () => {
    setStatus("approved");
    alert("Task approved!");
    navigate("/review");
  };

  const handleReturn = () => {
    setStatus("returned");
    alert("Task returned with feedback.");
    navigate("/review");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Review Task {id}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Labeled Data */}
          <Card className="p-4 space-y-3">
            <h2 className="font-semibold">Labeled Data</h2>
            <img
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600"
              className="rounded-lg"
            />
          </Card>

          {/* Guideline */}
          <Card className="p-4 space-y-3">
            <h2 className="font-semibold">Guideline</h2>
            <p className="text-sm text-gray-600">
              - Bounding boxes must tightly fit object  
              - Label must match category list  
              - No duplicate overlapping labels  
            </p>

            <Button variant="outline" onClick={detectInconsistency}>
              Detect Inconsistent Labels
            </Button>
          </Card>
        </div>

        {/* Feedback Section */}
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">Reviewer Feedback</h2>
          <Input
            placeholder="Enter feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Card>

        {/* Actions */}
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
