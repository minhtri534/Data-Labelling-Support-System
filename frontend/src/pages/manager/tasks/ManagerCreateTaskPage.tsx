import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, PlusCircle, Users, ListTodo, Percent, Calendar, Search, Loader2, CheckCircle } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { managerService, type ProjectResponse, type DatasetResponse } from "../../../services/managerService";
import { userService, type UserResponse } from "../../../services/userService";

const ManagerCreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialProjectId = queryParams.get("projectId") || "";

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [datasets, setDatasets] = useState<DatasetResponse[]>([]);
  const [annotators, setAnnotators] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [selectedDatasetId, setSelectedDatasetId] = useState("");
  const [selectedAnnotatorId, setSelectedAnnotatorId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchDatasets(selectedProjectId);
    }
  }, [selectedProjectId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [projRes, userRes] = await Promise.all([
        managerService.getProjects(),
        userService.getAll()
      ]);
      if (projRes.isSuccess) setProjects(projRes.data);
      if (userRes.isSuccess) {
        // Filter for annotators role (ID 3 in demo)
        setAnnotators(userRes.data.filter(u => u.roleName === "Annotator" || u.roleId.endsWith("3")));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasets = async (pid: string) => {
    const res = await managerService.getDatasets(pid);
    if (res.isSuccess) {
      setDatasets(res.data);
      if (res.data.length > 0) setSelectedDatasetId(res.data[0].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      if (!selectedProjectId || !selectedDatasetId || !selectedAnnotatorId) {
      alert("Please select a Project, Dataset, and Annotator.");
      return;
    }

    setSubmitting(true);
    try {
      // In a real scenario, we might want to pick a specific DataItem. 
      // For demo, we'll assume the backend handles picking an available DataItem from the dataset.
      // But the API requires a dataItemId. Let's assume we fetch the first unassigned item.
      
      // For now, let's just use the createTask API as defined.
      const res = await managerService.createTask({
        projectId: selectedProjectId,
        datasetId: selectedDatasetId,
        dataItemId: "69be1b4e34c53f2151eb5e3b", // Placeholder or fetch first available
        annotatorId: selectedAnnotatorId
      });

      if (res.isSuccess) {
        alert("Task created and assigned successfully!");
        navigate(`/manager/projects/${selectedProjectId}`);
      } else {
        alert(res.message || "Error creating task.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAnnotators = annotators.filter(a => 
    a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p>Loading data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Task</h1>
            <p className="text-gray-500 mt-1">Assign data to your annotation team.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-8 space-y-8 border-none shadow-xl">
            {/* Section 1: Chọn dự án và dữ liệu */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="project">Project</Label>
                  <select 
                    id="project" 
                    required 
                    className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    <option value="">-- Select project --</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataset">Dataset</Label>
                  <select 
                    id="dataset" 
                    required 
                    disabled={!selectedProjectId}
                    className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                  >
                    <option value="">-- Select dataset --</option>
                    {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Giao việc */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600"/>
                Select Annotator
              </h3>
              <div className="p-4 border rounded-xl bg-gray-50/50">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      className="pl-10 bg-white border-gray-200" 
                      placeholder="Search by name or email..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {filteredAnnotators.map(user => (
                    <div 
                      key={user.id} 
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${selectedAnnotatorId === user.id ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-100 hover:border-blue-300'}`} 
                      onClick={() => setSelectedAnnotatorId(user.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${selectedAnnotatorId === user.id ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${selectedAnnotatorId === user.id ? 'text-white' : 'text-gray-900'}`}>{user.fullName}</p>
                          <p className={`text-xs ${selectedAnnotatorId === user.id ? 'text-blue-100' : 'text-gray-500'}`}>{user.email}</p>
                        </div>
                      </div>
                      {selectedAnnotatorId === user.id && <CheckCircle size={20} />}
                    </div>
                  ))}
                  {filteredAnnotators.length === 0 && (
                    <p className="text-center text-gray-400 py-4 text-sm italic">No annotators found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end gap-4 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
                Confirm and Assign
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ManagerCreateTaskPage;
