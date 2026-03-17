import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { List, PlayCircle, CheckCircle, Clock } from "lucide-react";

const mockTasks = [
  {
    id: "1",
    projectName: "Project Alpha",
    taskName: "Labeling Batch 1",
    status: "Not Started",
    items: 100,
    progress: 0,
  },
  {
    id: "2",
    projectName: "Project Beta",
    taskName: "Reviewing Batch 3",
    status: "In Progress",
    items: 200,
    progress: 45,
  },
  {
    id: "3",
    projectName: "Project Gamma",
    taskName: "Urgent Corrections",
    status: "Completed",
    items: 50,
    progress: 100,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Not Started":
      return <Badge variant="secondary">{status}</Badge>;
    case "In Progress":
      return <Badge variant="primary">{status}</Badge>;
    case "Completed":
      return <Badge variant="success">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const AnnotatorTaskListPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Công việc của tôi</h1>
          <p className="text-gray-500 mt-1">Danh sách các công việc gán nhãn được giao cho bạn.</p>
        </div>

        <Card variant="glass" className="p-6">
          <div className="space-y-4">
            {mockTasks.map((task) => (
              <Card key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-md">
                    <List className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{task.taskName}</h3>
                    <p className="text-sm text-gray-500">
                      Dự án: {task.projectName} - {task.items} mục
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(task.status)}
                  <Link to={`/annotator/task/${task.id}`}>
                    <Button variant="outline">
                      {task.status === "Completed" ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Xem lại
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Bắt đầu
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnnotatorTaskListPage;
