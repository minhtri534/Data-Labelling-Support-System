import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function AnnotatorReworkPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [labels, setLabels] = useState("Car");

  const handleResubmit = () => {
    alert("Task resubmitted!");
    navigate("/annotator/returned");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Revise Task {id}</h1>

        {/* Image */}
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">Image</h2>
          <img
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600"
            className="rounded-lg"
          />
        </Card>

        {/* Edit Label */}
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">Edit Label</h2>
          <Input
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
          />
        </Card>

        {/* Comment to Reviewer */}
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">Comment to Reviewer</h2>
          <Input
            placeholder="Enter your response..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Card>

        <Button variant="gradient" onClick={handleResubmit}>
          Resubmit
        </Button>
      </div>
    </DashboardLayout>
  );
}
