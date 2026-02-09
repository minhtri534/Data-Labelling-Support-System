import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { Card } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const location = useLocation();

  const fromProfile = location.state?.from === 'profile';
  const backLink = fromProfile ? '/profile' : '/login';
  const backText = fromProfile ? 'Back to Profile' : 'Back to Sign in';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log('Reset password attempt:', { password });
    setIsSuccess(true);
  };

  return (
    <AuthLayout title="Secure your account" subtitle="Create a new strong password for your account." variant="simple">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Security</div>
            <h2 className="text-xl font-semibold text-gray-900">Set New Password</h2>
          </div>
        </div>

        {!isSuccess ? (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600">
              Your new password must be different from previously used passwords.
            </p>
            <div>
              <Label htmlFor="password">New Password</Label>
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
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
            
            <Button type="submit" fullWidth variant="gradient">
              Reset Password
            </Button>

            <div className="text-center text-sm text-gray-600">
              <Link to={backLink} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
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
                <h3 className="text-lg font-medium text-gray-900">Password Reset Complete</h3>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Your password has been successfully updated. You can now sign in with your new password.
                </p>
             </div>
            <Link to="/login">
              <Button fullWidth variant="gradient">
                Sign in
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
