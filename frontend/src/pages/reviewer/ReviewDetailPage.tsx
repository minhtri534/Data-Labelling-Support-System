import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { reviewerService, type ReviewerLabeledDataResponse } from "../../services/reviewerService";
import {
  Loader2,
  ArrowLeft,
  ShieldCheck,
  MessageSquare,
  XCircle,
  CheckCircle
} from "lucide-react";

const ReviewDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<ReviewerLabeledDataResponse | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secureImageUrl, setSecureImageUrl] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await reviewerService.openLabeledData(id);
        if (res.isSuccess) {
          setTask(res.data);
          
          // Fetch secure image
          try {
            const blob = await reviewerService.getImageSecure(id);
            const url = URL.createObjectURL(blob);
            setSecureImageUrl(url);
          } catch (err) {
            console.error("Error loading secure image:", err);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();

    // Cleanup object URL
    return () => {
      if (secureImageUrl) {
        URL.revokeObjectURL(secureImageUrl);
      }
    };
  }, [id]);

  const handleApprove = async () => {
    if (!id || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await reviewerService.approveTask(id, { score: 100, comment: feedback });
      if (res.isSuccess) {
        alert("Đã phê duyệt dữ liệu thành công.");
        navigate("/review");
      } else {
        alert(res.message || "Lỗi khi phê duyệt.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = async () => {
    if (!id || isSubmitting) return;
    if (!feedback.trim()) {
      alert("Vui lòng nhập phản hồi/lý do trả về.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await reviewerService.returnTask(id, { feedback, errorTypeIds: [] });
      if (res.isSuccess) {
        alert("Đã trả về yêu cầu sửa lại dữ liệu.");
        navigate("/review");
      } else {
        alert(res.message || "Lỗi khi thực hiện.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="font-medium text-lg">Loading labeled data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/review")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Review Details</h1>
          <Badge variant="primary" className="ml-auto">ID: {id?.slice(-6)}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CỘT TRÁI: HÌNH ẢNH DÁN NHÃN */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-4 bg-gray-900 overflow-auto min-h-[500px] flex items-center justify-center relative custom-scrollbar">
              <div 
                className="relative shadow-2xl"
                style={{ width: '800px', height: 'fit-content' }}
              >
                {secureImageUrl ? (
                  <img 
                    src={secureImageUrl} 
                    className="w-full h-auto block rounded" 
                    alt="Labeled Data"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-400 py-20">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Loading secure image...</p>
                  </div>
                )}
                
                {/* RENDERING ANNOTATIONS */}
                {task?.annotations.map((ann) => {
                  // GeometryData is stored as JSON string in demo database
                  let geo: any = ann.geometryData;
                  if (typeof geo === 'string') {
                    try { geo = JSON.parse(geo); } catch { return null; }
                  }

                  if (geo.type === "bbox" || (geo.x !== undefined && geo.width !== undefined)) {
                    return (
                      <div
                        key={ann.id}
                        className="absolute border-2 border-emerald-400 bg-emerald-400/20 group"
                        style={{
                          left: `${geo.x}px`,
                          top: `${geo.y}px`,
                          width: `${geo.width}px`,
                          height: `${geo.height}px`,
                        }}
                      >
                        <div className="absolute -top-6 left-0 bg-emerald-500 text-white text-[10px] px-1 py-0.5 rounded font-bold whitespace-nowrap">
                          {ann.labelName}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </Card>
          </div>

          {/* CỘT PHẢI: THÔNG TIN & ĐIỀU KHIỂN */}
          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShieldCheck className="text-blue-600 h-5 w-5" />
                Labeling Results
              </h2>
              <div className="space-y-3">
                {task?.annotations.map((ann) => (
                  <div key={ann.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="font-bold text-blue-700">{ann.labelName}</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded uppercase font-semibold text-gray-600">
                      {ann.annotationType}
                    </span>
                  </div>
                ))}
                {(!task?.annotations || task.annotations.length === 0) && (
                  <p className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">
                    No labels have been applied.
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <MessageSquare className="text-green-600 h-5 w-5" />
                Review Feedback
              </h2>
              <textarea
                className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Enter comments or revision instructions here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  onClick={handleReturn}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Return
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleApprove}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReviewDetailPage;
