import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function AdminDisputePage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dispute Management</h1>

        <Card className="p-6 space-y-4">
          <p>Dispute ID: DSP-001</p>
          <p>Reason: Payment mismatch</p>

          <Button variant="gradient">
            Resolve Dispute
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
