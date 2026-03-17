import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

type Report = {
  total: number;
  accuracy: number;
  issues: number;
};

export default function QualityReportPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    // Fake API
    setTimeout(() => {
      setReport({
        total: 320,
        accuracy: 98.7,
        issues: 14
      });
    }, 500);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Quality Report</h1>

        {!report && <p>Loading report...</p>}

        {report && (
          <Card className="p-6 space-y-3">
            <p>Total Tasks Reviewed: {report.total}</p>
            <p>Accuracy Rate: {report.accuracy}%</p>
            <p>Issues Detected: {report.issues}</p>

            <Button variant="gradient">
              Export Report (PDF)
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
