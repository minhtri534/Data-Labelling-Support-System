import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";

const MOCK_REVIEWS = [
  { id: "REV-3001", project: "Vehicle Detection", amount: 8, status: "Paid" },
  { id: "REV-3002", project: "Medical Segmentation", amount: 10, status: "Pending" }
];

export default function ReviewerEarningsPage() {
  const total = MOCK_REVIEWS.reduce((sum, r) => sum + r.amount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Reviewer Earnings</h1>

        <Card className="p-6">
          <p>Total Compensation: <strong>${total}</strong></p>
        </Card>

        {MOCK_REVIEWS.map(review => (
          <Card key={review.id} className="p-4">
            <p>{review.project}</p>
            <p className="text-sm text-gray-500">
              {review.id} • ${review.amount} • {review.status}
            </p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
