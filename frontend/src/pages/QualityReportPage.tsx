import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function QualityReportPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Quality Report</h1>

        <Card className="p-6 space-y-3">
          <p>Total Tasks Reviewed: 320</p>
          <p>Accuracy Rate: 98.7%</p>
          <p>Issues Detected: 14</p>

          <Button variant="gradient">
            Export Report (PDF)
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
