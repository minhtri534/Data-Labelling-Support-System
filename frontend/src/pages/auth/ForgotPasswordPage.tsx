import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, ArrowLeft, AlertCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import { Card } from "../../components/ui/Card";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { authService } from "../../services/authService";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      if (response.isSuccess) {
        setIsSubmitted(true);
      } else {
        setError(response.message || "Đã có lỗi xảy ra");
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || "Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Khôi phục mật khẩu" subtitle="Chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản." variant="simple">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <KeyRound className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Khôi phục tài khoản</div>
            <h2 className="text-xl font-semibold text-gray-900">Quên mật khẩu</h2>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!isSubmitted ? (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600">
              Nhập địa chỉ email được liên kết với tài khoản của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
            </p>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                leadingIcon={<Mail className="h-5 w-5" />}
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <Button type="submit" fullWidth variant="gradient" disabled={loading}>
              {loading ? "Đang xử lý..." : "Gửi liên kết đặt lại"}
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              <Link to="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Quay lại Đăng nhập
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-lg bg-green-50 p-4 border border-green-100">
              <p className="text-sm text-green-800 text-center">
                Nếu tài khoản tồn tại cho <strong>{email}</strong>, bạn sẽ sớm nhận được liên kết đặt lại mật khẩu.
              </p>
            </div>
            <Button fullWidth variant="outline" onClick={() => setIsSubmitted(false)}>
              Thử với email khác
            </Button>
            <div className="text-center text-sm text-gray-600">
              <Link to="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Quay lại Đăng nhập
              </Link>
            </div>
          </div>
        )}
      </Card>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;

