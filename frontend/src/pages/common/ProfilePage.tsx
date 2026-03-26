import React, { useMemo, useState } from 'react';
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
  Lock,
  Badge
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: localStorage.getItem("fullName") || 'User',
    email: localStorage.getItem("email") || 'user@example.com',
    phone: '+84 (000) 000-000',
    location: 'Vietnam',
    bio: 'Specialist at the DLSS platform.',
    role: (localStorage.getItem("role") || 'Annotator').toUpperCase(),
    department: 'Data Survey Department'
  });

  const initials = useMemo(() => {
    return formData.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [formData.fullName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically handle the API call to update profile
    console.log('Profile updated:', formData);
    alert("Profile updated successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Profile
          </h1>
          <p className="text-gray-500 mt-1">Manage your personal information and account settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="space-y-6">
            <Card className="p-6 flex flex-col items-center text-center border-none shadow-sm">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-4">
                  {initials}
                </div>
                <button className="absolute bottom-4 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900">{formData.fullName}</h2>
              <Badge className="mt-1 px-4 py-1 bg-blue-50 text-blue-600 border border-blue-600">{formData.role}</Badge>
              
              <div className="mt-8 w-full space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-sm text-gray-500">Activity</span>
                  <span className="text-sm font-bold text-gray-900">Stable</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-sm text-gray-500">Reliability</span>
                  <span className="text-sm font-bold text-green-600">99.2%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Account status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-600 font-medium">Email verified</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-600 font-medium">Two-factor auth: Off</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-600 font-medium">Active</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link to="/change-password">
                  <Button variant="outline" className="w-full justify-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Change password
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-none shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Details</h3>
                <Button 
                  variant={isEditing ? "ghost" : "primary"} 
                  onClick={() => !isEditing && setIsEditing(true)}
                  className={isEditing ? "text-gray-500" : "bg-blue-600 hover:bg-blue-700"}
                >
                  {isEditing ? 'Cancel' : 'Edit profile'}
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Address</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About me</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full mt-1 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-6 border-t border-gray-100">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8">
                      <Save className="h-4 w-4 mr-2" />
                      Save changes
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
