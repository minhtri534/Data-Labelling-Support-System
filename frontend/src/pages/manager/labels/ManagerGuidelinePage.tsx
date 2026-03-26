import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, FileText } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";
import { managerService } from "../../../services/managerService";

const ManagerGuidelinePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!projectId) {
      alert("Missing projectId");
      return;
    }

    setLoading(true);
    try {
      const res = await managerService.updateGuideline(projectId, content);
      if (res.isSuccess) {
        alert("Guideline saved successfully!");
      } else {
        alert(res.message);
      }
    } catch {
      alert("Error saving guideline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/manager/projects">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Guideline
              </h1>
              <p className="text-gray-500">
                Write instructions for annotators.
              </p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Guideline"}
          </Button>
        </div>

        <Card className="p-6">
          <Label className="mb-3 block">
            Guideline Content (Markdown supported)
          </Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            className="font-mono"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManagerGuidelinePage;