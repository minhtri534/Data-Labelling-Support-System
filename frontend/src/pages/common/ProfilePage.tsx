import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Shield, 
  Lock
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Senior Data Reviewer with 5 years of experience in computer vision datasets. Specialized in autonomous driving and medical imaging.',
    role: 'Senior Reviewer',
    department: 'Quality Assurance'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically handle the API call to update profile
    console.log('Profile updated:', formData);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-brand to-palette-violet tracking-tight">
            Personal Profile
          </h1>
          <p className="text-gray-500 mt-1">Manage your personal information and account settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="space-y-6">
            <Card variant="glass" className="p-6 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-brand to-palette-violet flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-brand/20 mb-4">
                  JD
                </div>
                <button className="absolute bottom-4 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-brand transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{formData.fullName}</h2>
              <p className="text-brand font-medium">{formData.role}</p>
              
              <div className="mt-6 w-full space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-white/40">
                  <span className="text-sm text-gray-500">Reviews</span>
                  <span className="text-sm font-bold text-gray-900">1,248</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-white/40">
                  <span className="text-sm text-gray-500">Accuracy</span>
                  <span className="text-sm font-bold text-green-600">99.2%</span>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand" />
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-600">Email Verified</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-600">2FA Enabled</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-600">Active Status</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link to="/change-password">
                  <Button variant="outline" className="w-full justify-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-2">
            <Card variant="glass" className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Profile Details</h3>
                <Button 
                  variant={isEditing ? "ghost" : "gradient"} 
                  onClick={() => !isEditing && setIsEditing(true)}
                  className={isEditing ? "text-gray-500" : ""}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leadingIcon={<User className="h-4 w-4" />}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leadingIcon={<Mail className="h-4 w-4" />}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leadingIcon={<Phone className="h-4 w-4" />}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leadingIcon={<MapPin className="h-4 w-4" />}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full mt-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button type="submit" variant="gradient">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
