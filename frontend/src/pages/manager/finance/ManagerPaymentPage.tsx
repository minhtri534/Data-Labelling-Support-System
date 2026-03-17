import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export default function ManagerPaymentPage() {
  const [status, setStatus] = useState("Pending");

  const handlePayment = () => {
    setStatus("Completed");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Project Payment</h1>

        <Card className="p-6 space-y-4">
          <p>Payment Status: <strong>{status}</strong></p>

          <Button variant="gradient" onClick={handlePayment}>
            Make Payment
          </Button>

          <Button variant="outline">
            Download Invoice
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
