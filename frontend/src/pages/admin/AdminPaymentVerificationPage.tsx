import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function AdminPaymentVerificationPage() {
  const [status, setStatus] = useState("Pending Verification");

  const handleVerify = () => {
    setStatus("Verified");
  };

  const handleRefund = () => {
    setStatus("Refunded");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Payment Verification</h1>

        <Card className="p-6 space-y-4">
          <p>Project ID: PRJ-001</p>
          <p>Status: <strong>{status}</strong></p>

          <div className="flex gap-4">
            <Button variant="gradient" onClick={handleVerify}>
              Verify Payment
            </Button>

            <Button variant="outline" onClick={handleRefund}>
              Refund Payment
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
