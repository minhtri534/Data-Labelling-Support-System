import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export default function ManagerCostApprovalPage() {
  const estimatedCost = 8500;

  const handleApprove = () => {
    alert("Project cost approved!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Approve Project Cost</h1>

        <Card className="p-6 space-y-4">
          <p>Estimated Cost: ${estimatedCost}</p>

          <Button variant="gradient" onClick={handleApprove}>
            Approve Cost
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
