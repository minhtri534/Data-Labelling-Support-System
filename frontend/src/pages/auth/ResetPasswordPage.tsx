import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import { Card } from "../../components/ui/Card";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { authService } from "../../services/authService";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy email và token từ URL (ví dụ: /reset-password?token=abc&email=test@gmail.com)
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token') || '';
  const email = queryParams.get('email') || '';

  const fromProfile = location.state?.from === 'profile';
  const backLink = fromProfile ? '/profile' : '/login';
  const backText = fromProfile ? 'Quay lại Trang cá nhân' : 'Quay lại Đăng nhập';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (!token || !email) {
      setError("Liên kết khôi phục mật khẩu không hợp lệ hoặc đã hết hạn");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        resetToken: token,
        newPassword: password
      });

      if (response.isSuccess) {
        setIsSuccess(true);
      } else {
        setError(response.message || "Đã có lỗi xảy ra");
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || "Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Bảo mật tài khoản" subtitle="Tạo mật khẩu mới mạnh mẽ cho tài khoản của bạn." variant="simple">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Bảo mật</div>
            <h2 className="text-xl font-semibold text-gray-900">Đặt mật khẩu mới</h2>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!isSuccess ? (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600">
              Mật khẩu mới của bạn phải khác với các mật khẩu đã sử dụng trước đó.
            </p>
            <div>
              <Label htmlFor="password">Mật khẩu mới</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                leadingIcon={<Lock className="h-5 w-5" />}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
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
            
            <Button type="submit" fullWidth variant="gradient" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <Link to={backLink} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4" /> {backText}
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-5">
             <div className="flex flex-col items-center justify-center py-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Hoàn tất đặt lại mật khẩu</h3>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Mật khẩu của bạn đã được cập nhật thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
                </p>
             </div>
            <Link to="/login">
              <Button fullWidth variant="gradient">
                Đăng nhập ngay
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </AuthLayout>
  );
};

export default ResetPasswordPage;

