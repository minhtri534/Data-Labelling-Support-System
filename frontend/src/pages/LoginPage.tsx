import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { Card } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <AuthLayout title="Sign in to continue" subtitle="Access projects, tasks, and analytics in one place.">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <LogIn className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Welcome back</div>
            <h2 className="text-xl font-semibold text-gray-900">Sign in</h2>
          </div>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              leadingIcon={<Mail className="h-5 w-5" />}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Remember me</span>
            </div>
            <Link to="#" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot password
            </Link>
          </div>
          <Button type="submit" fullWidth variant="gradient">
            Sign in
          </Button>
          <div className="text-center text-sm text-gray-600">
            New to platform?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700">
              Create account
            </Link>
          </div>
        </form>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
