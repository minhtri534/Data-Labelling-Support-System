import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { Card } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Forgot password request:', { email });
    setIsSubmitted(true);
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll help you get back into your account." variant="simple">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <KeyRound className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Account Recovery</div>
            <h2 className="text-xl font-semibold text-gray-900">Forgot Password</h2>
          </div>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
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
            
            <Button type="submit" fullWidth variant="gradient">
              Send Reset Link
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              <Link to="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back to Sign in
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-lg bg-green-50 p-4 border border-green-100">
              <p className="text-sm text-green-800 text-center">
                If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
              </p>
            </div>
            <Button fullWidth variant="outline" onClick={() => setIsSubmitted(false)}>
              Try another email
            </Button>
            <div className="text-center text-sm text-gray-600">
              <Link to="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back to Sign in
              </Link>
            </div>
          </div>
        )}
      </Card>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
