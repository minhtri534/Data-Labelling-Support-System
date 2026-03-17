import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";

export default function ManagerExpenseReportPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Expense Report</h1>

        <Card className="p-6 space-y-3">
          <p>Total Tasks: 500</p>
          <p>Total Cost: $8,500</p>
          <p>Paid: $4,000</p>
          <p>Remaining: $4,500</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
