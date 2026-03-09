import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { authService } from "../services/authService";

const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.changePassword({
        currentPassword,
        newPassword
      });

      if (response.isSuccess) {
        setSuccess("Đổi mật khẩu thành công!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Tùy chọn: Chuyển hướng sau vài giây
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setError(response.message || "Đổi mật khẩu thất bại");
      }
    } catch (err: any) {
      console.error('Change password error:', err);
      setError(err.response?.data?.message || "Mật khẩu hiện tại không chính xác hoặc lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Đổi mật khẩu
            </h1>
            <p className="text-gray-500 mt-1">Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn.</p>
          </div>
        </div>

        <Card variant="glass" className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Bảo mật tài khoản</div>
              <h2 className="text-xl font-semibold text-gray-900">Thiết lập mật khẩu</h2>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                leadingIcon={<Lock className="h-5 w-5" />}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  leadingIcon={<Lock className="h-5 w-5" />}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  leadingIcon={<Lock className="h-5 w-5" />}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Link to="/profile">
                <Button type="button" variant="ghost">Hủy bỏ</Button>
              </Link>
              <Button type="submit" variant="gradient" disabled={loading}>
                {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChangePasswordPage;
