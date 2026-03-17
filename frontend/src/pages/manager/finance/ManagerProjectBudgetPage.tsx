import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function ManagerProjectBudgetPage() {
  const [budget, setBudget] = useState("");
  const estimatedCost = 8500;

  const handleSave = () => {
    alert("Budget saved!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Project Budget</h1>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Define Budget</h2>
          <Input
            placeholder="Enter budget (USD)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <div className="text-sm text-gray-600">
            Estimated Cost: <strong>${estimatedCost}</strong>
          </div>

          <Button variant="gradient" onClick={handleSave}>
            Save Budget
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
