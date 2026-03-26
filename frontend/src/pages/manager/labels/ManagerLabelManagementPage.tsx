import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Tag, Edit2, Trash2, Settings, HelpCircle, Save, AlertCircle, Loader } from "lucide-react";
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

  // Form states
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [labelName, setLabelName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setError("Project ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [catResponse, labelResponse] = await Promise.all([
          managerService.getLabelCategories(projectId),
          managerService.getLabels(projectId),
        ]);

        if (catResponse.isSuccess && catResponse.data) {
          setCategories(catResponse.data);
          if (catResponse.data.length > 0) {
            setSelectedCategory(catResponse.data[0]);
            setCategoryName(catResponse.data[0].name);
            setCategoryDescription(catResponse.data[0].description || "");
          }
        }

        if (labelResponse.isSuccess && labelResponse.data) {
          setLabels(labelResponse.data);
        }

        if (!catResponse.isSuccess) {
          setError(catResponse.message || "Failed to fetch categories");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleCategorySelect = (category: LabelCategoryResponse) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!window.confirm(`Delete category "${categoryName}"?`)) return;

    try {
      const response = await managerService.deleteLabelCategory(categoryId);
      if (response.isSuccess) {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        if (selectedCategory?.id === categoryId) {
          setSelectedCategory(null);
        }
      } else {
        alert(response.message || "Failed to delete category");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete category");
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    if (!window.confirm("Delete this label?")) return;

    try {
      const response = await managerService.deleteLabel(labelId);
      if (response.isSuccess) {
        setLabels(prev => prev.filter(l => l.id !== labelId));
      } else {
        alert(response.message || "Failed to delete label");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete label");
    }
  };

  const getCategoryLabels = () => {
    if (!selectedCategory) return [];
    return labels.filter(l => l.categoryId === selectedCategory.id);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {error && (
          <Card variant="glass" className="p-4 bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={projectId ? `/manager/projects/${projectId}` : "/manager/projects"} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Label Configuration</h1>
              <p className="text-gray-500 mt-1">Define label categories and rules for your project.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Danh sách danh mục bên trái */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-semibold text-gray-700 uppercase text-xs tracking-wider">Categories ({categories.length})</h3>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">No categories yet</p>
            ) : (
              categories.map(cat => (
                <Card 
                  key={cat.id} 
                  className={`p-4 cursor-pointer border-2 transition-all ${
                    selectedCategory?.id === cat.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-transparent hover:border-blue-300"
                  }`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900">{cat.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{cat.description || "No description"}</div>
                    </div>
                    <Tag className="h-4 w-4 text-blue-500" />
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Chi tiết chỉnh sửa bên phải */}
          {selectedCategory ? (
            <div className="md:col-span-2">
              <Card variant="glass" className="p-8 space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-xl font-bold text-gray-800">Category: {selectedCategory.name}</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteCategory(selectedCategory.id, selectedCategory.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Category Name</Label>
                    <Input 
                      value={categoryName} 
                      onChange={(e) => setCategoryName(e.currentTarget.value)}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input 
                      value={categoryDescription} 
                      onChange={(e) => setCategoryDescription(e.currentTarget.value)}
                      disabled
                      placeholder="No description"
                    />
                  </div>
                  
                  <div>
                    <Label>Labels in Category</Label>
                    <div className="space-y-2 mt-2">
                      {getCategoryLabels().length === 0 ? (
                        <p className="text-sm text-gray-500">No labels in this category</p>
                      ) : (
                        getCategoryLabels().map((label) => (
                          <div key={label.id} className="flex gap-2 items-center p-2 bg-gray-50 rounded">
                            <Input 
                              value={label.name} 
                              disabled
                              className="flex-1"
                            />
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                              Class {label.yoloClassId}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleDeleteLabel(label.id)}
                            >
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="md:col-span-2">
              <Card variant="glass" className="p-8">
                <p className="text-center text-gray-500 py-8">Select a category to view details</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerLabelManagementPage;
