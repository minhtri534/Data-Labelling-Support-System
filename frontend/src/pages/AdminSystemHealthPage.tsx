import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";

export default function AdminSystemHealthPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">System Health</h1>

        <Card className="p-6 space-y-3">
          <p>API Status: ✅ Online</p>
          <p>Database: ✅ Connected</p>
          <p>Server Load: 35%</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
