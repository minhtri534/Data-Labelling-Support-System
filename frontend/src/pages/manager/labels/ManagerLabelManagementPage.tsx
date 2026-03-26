import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Tag, Trash2, Plus, Loader, AlertCircle } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { managerService } from "../../../services/managerService";
import type { LabelCategoryResponse, LabelResponse } from "../../../types/manager";

const ManagerLabelManagementPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [categories, setCategories] = useState<LabelCategoryResponse[]>([]);
  const [labels, setLabels] = useState<LabelResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<LabelCategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newLabelName, setNewLabelName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setError("Missing projectId");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [catRes, labelRes] = await Promise.all([
          managerService.getLabelCategories(projectId),
          managerService.getLabels(projectId),
        ]);

        if (catRes.isSuccess && catRes.data) {
          setCategories(catRes.data);
          setSelectedCategory(catRes.data[0] || null);
        }

        if (labelRes.isSuccess && labelRes.data) {
          setLabels(labelRes.data);
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleCreateCategory = async () => {
    if (!projectId || !newCategoryName) return;

    const res = await managerService.createLabelCategory({
      projectId,
      name: newCategoryName,
    });

    if (res.isSuccess && res.data) {
      setCategories(prev => [...prev, res.data]);
      setNewCategoryName("");
    } else {
      alert(res.message);
    }
  };

  const handleCreateLabel = async () => {
    if (!projectId || !newLabelName) return;

    const res = await managerService.createLabel({
      projectId,
      name: newLabelName,
      yoloClassId: Math.floor(Math.random() * 1000),
    });

    if (res.isSuccess && res.data) {
      setLabels(prev => [...prev, res.data]);
      setNewLabelName("");
    } else {
      alert(res.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    const res = await managerService.deleteLabelCategory(id);
    if (res.isSuccess) {
      setCategories(prev => prev.filter(c => c.id !== id));
      if (selectedCategory?.id === id) setSelectedCategory(null);
    }
  };

  const handleDeleteLabel = async (id: string) => {
    if (!confirm("Delete this label?")) return;

    const res = await managerService.deleteLabel(id);
    if (res.isSuccess) {
      setLabels(prev => prev.filter(l => l.id !== id));
    }
  };

  const categoryLabels = labels.filter(l => l.categoryId === selectedCategory?.id);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-10">
          <Loader className="animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {error && (
          <Card className="p-4 text-red-600 flex items-center gap-2">
            <AlertCircle /> {error}
          </Card>
        )}

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to={`/manager/projects/${projectId}`}>
            <ArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold">Label Management</h1>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="space-y-4">
            <h3 className="font-semibold">Categories</h3>

            {/* Create category */}
            <div className="flex gap-2">
              <Input
                placeholder="New category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Button onClick={handleCreateCategory}>
                <Plus size={16} />
              </Button>
            </div>

            {categories.map(c => (
              <Card
                key={c.id}
                className={`p-3 cursor-pointer ${
                  selectedCategory?.id === c.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedCategory(c)}
              >
                {c.name}
              </Card>
            ))}
          </div>

          {/* RIGHT */}
          <div className="col-span-2 space-y-4">
            {selectedCategory ? (
              <Card className="p-6 space-y-4">
                <div className="flex justify-between">
                  <h2>{selectedCategory.name}</h2>
                  <Button onClick={() => handleDeleteCategory(selectedCategory.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* Create label */}
                <div className="flex gap-2">
                  <Input
                    placeholder="New label"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                  />
                  <Button onClick={handleCreateLabel}>
                    <Plus size={16} />
                  </Button>
                </div>

                {categoryLabels.map(l => (
                  <div key={l.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>{l.name}</span>
                    <Button onClick={() => handleDeleteLabel(l.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </Card>
            ) : (
              <Card className="p-6 text-center text-gray-500">
                Select a category
              </Card>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerLabelManagementPage;