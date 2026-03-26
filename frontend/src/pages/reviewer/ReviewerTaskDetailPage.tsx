import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { reviewService } from "../../services/reviewService";
import type { ReviewAnnotation, SubmitReviewRequest } from "../../types/review";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Textarea } from "../../components/ui/Textarea";
import { Check, X } from "lucide-react";

const ReviewerTaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [annotations, setAnnotations] = useState<ReviewAnnotation[]>([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!taskId) return;
    reviewService.getAnnotations(taskId).then(res => {
      if (res.isSuccess) {
        setAnnotations(res.data || []);
      }
    });
  }, [taskId]);

  const handleSubmit = async (isApproved: boolean) => {
    if (!taskId) return;

    const data: SubmitReviewRequest = { isApproved };
    if (!isApproved) {
      data.comment = comment;
      // In a real app, you'd select error types
      data.errorTypeIds = []; 
    }

    const res = await reviewService.submitReview(taskId, data);
    if (res.isSuccess) {
      alert(`Review submitted successfully (Approved: ${isApproved})`);
      navigate("/reviewer/tasks");
    } else {
      alert(res.message || "Failed to submit review");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Review Task #{taskId?.slice(-6)}</h1>
        
        {/* Placeholder for annotation display */}
        <Card className="p-6 mb-6">
          <h2 className="font-bold mb-2">Annotations</h2>
          <div className="space-y-2">
            {annotations.map(ann => (
              <div key={ann.id} className="p-2 border rounded bg-gray-50">
                Annotation ID: {ann.id}, Label: {ann.labelId}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold mb-2">Review Decision</h2>
          <Textarea 
            placeholder="Add a comment if you are rejecting..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="mb-4"
          />
          <div className="flex gap-4">
            <Button onClick={() => handleSubmit(true)} className="bg-green-600 hover:bg-green-700 flex-1">
              <Check className="mr-2" /> Approve
            </Button>
            <Button onClick={() => handleSubmit(false)} variant="danger" className="flex-1">
              <X className="mr-2" /> Reject
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewerTaskDetailPage;
