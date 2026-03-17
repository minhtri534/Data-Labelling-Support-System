import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

const MOCK_LOGS = [
  "User A created project",
  "Reviewer approved TASK-1001",
  "Admin changed pricing model"
];

export default function AdminLogsPage() {

  const handleExport = () => {
    alert("Logs exported successfully.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">System Logs</h1>

        <Card className="p-6 space-y-2">
          {MOCK_LOGS.map((log, index) => (
            <p key={index} className="text-sm text-gray-600">
              {log}
            </p>
          ))}

          <Button variant="outline" onClick={handleExport}>
            Export Logs
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
