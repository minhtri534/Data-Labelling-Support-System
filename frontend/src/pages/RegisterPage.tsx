import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { Card } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Register attempt:', formData);
  };

  return (
    <AuthLayout title="Create an account" subtitle="Start managing datasets and tasks with ease.">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Get started</div>
            <h2 className="text-xl font-semibold text-gray-900">Create account</h2>
          </div>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              leadingIcon={<User className="h-5 w-5" />}
              placeholder="Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              leadingIcon={<Mail className="h-5 w-5" />}
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              leadingIcon={<Lock className="h-5 w-5" />}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              leadingIcon={<Lock className="h-5 w-5" />}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
            <span className="text-sm text-gray-700">I agree to the Terms and Conditions</span>
          </div>
          <Button type="submit" fullWidth variant="gradient">
            Create account
          </Button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </AuthLayout>
  );
};

export default RegisterPage;
