import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function AnnotatorAILabelPage() {
  const [aiLabel, setAiLabel] = useState<string | null>(null);
  const [finalLabel, setFinalLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestAI = () => {
    setLoading(true);

    // Mock AI delay
    setTimeout(() => {
      setAiLabel("Car");
      setLoading(false);
    }, 1500);
  };

  const handleAccept = () => {
    if (aiLabel) {
      setFinalLabel(aiLabel);
      alert("AI label accepted!");
    }
  };

  const handleReject = () => {
    setAiLabel(null);
    alert("AI suggestion rejected.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">AI-Assisted Labeling</h1>

        <Card className="p-4 space-y-3">
          <img
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600"
            className="rounded-lg"
          />
        </Card>

        <Card className="p-4 space-y-3">
          <Button
            variant="gradient"
            onClick={handleRequestAI}
            disabled={loading}
          >
            {loading ? "Generating..." : "Request AI Suggestion"}
          </Button>
        </Card>

        {aiLabel && (
          <Card className="p-4 space-y-3">
            <h2 className="font-semibold">AI Suggested Label</h2>

            <div className="text-lg font-medium text-blue-600">
              {aiLabel}
            </div>

            <div className="flex gap-4">
              <Button variant="gradient" onClick={handleAccept}>
                Accept
              </Button>

              <Button variant="outline" onClick={handleReject}>
                Reject
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">Final Label</h2>

          <Input
            placeholder="Modify or enter label..."
            value={finalLabel}
            onChange={(e) => setFinalLabel(e.target.value)}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}