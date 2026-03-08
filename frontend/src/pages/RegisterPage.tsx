import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, Lock, Phone, CreditCard, MapPin, Calendar, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { Card } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { authService } from "../services/authService";

// Helper để hiển thị lỗi input
const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <span className="flex items-center gap-1 mt-1 text-xs text-red-500 font-medium">
      <AlertCircle className="h-3 w-3" />
      {message}
    </span>
  );
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    identifyNumber: '',
    gender: '',
    address: '',
    dateOfBirth: '',
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    } else if (formData.fullName.length > 150) {
      newErrors.fullName = "Họ và tên không được quá 150 ký tự";
    }
    
    if (!formData.email) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    } else if (formData.email.length > 320) {
      newErrors.email = "Email không được quá 320 ký tự";
    }
    
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (formData.password.length > 128) {
      newErrors.password = "Mật khẩu không được quá 128 ký tự";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (formData.phoneNumber && formData.phoneNumber.length > 20) {
      newErrors.phoneNumber = "Số điện thoại không được quá 20 ký tự";
    }

    if (formData.identifyNumber && formData.identifyNumber.length > 20) {
      newErrors.identifyNumber = "CMND/CCCD không được quá 20 ký tự";
    }

    if (formData.address && formData.address.length > 300) {
      newErrors.address = "Địa chỉ không được quá 300 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);
    setErrors({}); // Reset lỗi cũ

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || undefined,
        identifyNumber: formData.identifyNumber || undefined,
        gender: formData.gender || undefined,
        address: formData.address || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
      });

      if (response.isSuccess) {
        setSuccessMessage(response.message || "Đăng ký tài khoản thành công!");
        
        // Đợi 2 giây để người dùng thấy thông báo rồi mới chuyển trang
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setServerError(response.message || "Đăng ký thất bại");
      }
    } catch (err: any) {
      console.error('Register error:', err);
      
      // Xử lý lỗi validation từ ASP.NET Core (400 Bad Request)
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const newErrors: Record<string, string> = {};
        
        // Map lỗi từ backend về frontend (Ví dụ: Email -> email)
        Object.keys(backendErrors).forEach(key => {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          newErrors[fieldName] = backendErrors[key][0]; // Lấy câu thông báo lỗi đầu tiên
        });
        
        setErrors(newErrors);
        setServerError("Vui lòng kiểm tra lại các thông tin đã nhập.");
      } else {
        setServerError(err.response?.data?.message || "Đã có lỗi xảy ra khi kết nối đến server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Bắt đầu quản lý dữ liệu và tác vụ một cách dễ dàng.">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Bắt đầu nào</div>
            <h2 className="text-xl font-semibold text-gray-900">Đăng ký tài khoản</h2>
          </div>
        </div>

        {serverError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Thông tin cơ bản */}
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Thông tin đăng nhập</h3>
              <div>
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  leadingIcon={<User className="h-5 w-5" />}
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "border-red-500 focus:ring-red-200" : ""}
                />
                <ErrorMessage message={errors.fullName} />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  leadingIcon={<Mail className="h-5 w-5" />}
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500 focus:ring-red-200" : ""}
                />
                <ErrorMessage message={errors.email} />
              </div>
              <div>
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  leadingIcon={<Lock className="h-5 w-5" />}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500 focus:ring-red-200" : ""}
                />
                <ErrorMessage message={errors.password} />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  leadingIcon={<Lock className="h-5 w-5" />}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-red-500 focus:ring-red-200" : ""}
                />
                <ErrorMessage message={errors.confirmPassword} />
              </div>
            </div>

            {/* Thông tin cá nhân */}
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Thông tin cá nhân</h3>
              <div>
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  leadingIcon={<Phone className="h-5 w-5" />}
                  placeholder="0987xxxxxx"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={errors.phoneNumber ? "border-red-500 focus:ring-red-200" : ""}
                />
                <ErrorMessage message={errors.phoneNumber} />
              </div>
              <div>
                <Label htmlFor="identifyNumber">Số CMND/CCCD</Label>
                <Input
                  id="identifyNumber"
                  name="identifyNumber"
                  type="text"
                  leadingIcon={<CreditCard className="h-5 w-5" />}
                  placeholder="031xxxxxxxx"
                  value={formData.identifyNumber}
                  onChange={handleChange}
                  className={errors.identifyNumber ? "border-red-500 focus:ring-red-200" : ""}
                />
                <ErrorMessage message={errors.identifyNumber} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Giới tính</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <select
                      id="gender"
                      name="gender"
                      className="w-full h-11 rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Chọn...</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    leadingIcon={<Calendar className="h-5 w-5" />}
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  leadingIcon={<MapPin className="h-5 w-5" />}
                  placeholder="Số nhà, tên đường, quận/huyện..."
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-6">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
              <span className="text-sm text-gray-700">Tôi đồng ý với Điều khoản và Điều kiện</span>
            </div>
            
            <Button type="submit" fullWidth variant="gradient" disabled={loading}>
              {loading ? "Đang xử lý..." : "Tạo tài khoản"}
            </Button>
            
            <div className="text-center mt-6 text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700">
                Đăng nhập
              </Link>
            </div>
          </div>
        </form>
      </Card>
    </AuthLayout>
  );
};

export default RegisterPage;


