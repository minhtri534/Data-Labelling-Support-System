import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function AdminWorkforcePaymentPage() {
  const [status, setStatus] = useState("Pending");

  const handleCalculate = () => {
    alert("Payments calculated!");
  };

  const handleApprove = () => {
    setStatus("Approved");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Workforce Payment</h1>

        <Card className="p-6 space-y-4">
          <p>Status: <strong>{status}</strong></p>

          <Button variant="outline" onClick={handleCalculate}>
            Calculate Payments
          </Button>

          <Button variant="gradient" onClick={handleApprove}>
            Approve Payment
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
