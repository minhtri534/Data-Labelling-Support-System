import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { Card } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { authService } from "../services/authService";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      handleLoginSuccess(response);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Email hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (response: any) => {
    if (response.isSuccess && response.data) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("fullName", response.data.fullName);
      
      const role = "annotator"; 
      localStorage.setItem("role", role);

      const DEFAULT_ROUTE_BY_ROLE: Record<string, string> = {
        reviewer: "/reviewer",
        annotator: "/annotator/returned",
        manager: "/manager/budget",
        admin: "/admin/users",
      };
      
      navigate(DEFAULT_ROUTE_BY_ROLE[role]);
    } else {
      setError(response.message || "Đăng nhập thất bại");
    }
  };

  const handleGoogleLogin = () => {
    // Trong thực tế, bạn sẽ dùng thư viện @react-oauth/google
    // Ở đây tôi demo luồng xử lý sau khi có idToken từ Google
    alert("Tính năng này yêu cầu Client ID từ Google Cloud Console. Vui lòng cấu hình trong appsettings.json và cài đặt thư viện frontend.");
  };

  return (
    <AuthLayout title="Đăng nhập để tiếp tục" subtitle="Truy cập dự án, tác vụ và phân tích tại một nơi.">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <LogIn className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Chào mừng trở lại</div>
            <h2 className="text-xl font-semibold text-gray-900">Đăng nhập</h2>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Ghi nhớ đăng nhập</span>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Quên mật khẩu?
            </Link>
          </div>
          <Button type="submit" fullWidth variant="gradient" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Tiếp tục với Google
          </button>

          <div className="text-center mt-6 text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700">
              Tạo tài khoản ngay
            </Link>
          </div>
        </form>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
