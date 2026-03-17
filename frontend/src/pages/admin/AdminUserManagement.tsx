import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { INITIAL_USERS } from '../../data/mockData';
import type { User } from '../../data/mockData';
import {
  Users,
  Search,
  Key,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Edit,
  Shield
} from 'lucide-react';

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<User['role']>('annotator');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =============================
  // CREATE USER (UC-99)
  // =============================
  const handleCreateUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'active',
      lastActive: 'Just now'
    };

    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    alert('User created successfully');
  };

  // =============================
  // UPDATE ROLE (UC-101 + UC-105)
  // =============================
  const handleChangeRole = (id: string, role: User['role']) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, role } : u
    ));
  };

  // =============================
  // DISABLE USER (UC-102)
  // =============================
  const handleDisableUser = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: 'inactive' } : u
    ));
  };

  // =============================
  // DELETE USER (UC-103)
  // =============================
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // =============================
  // RESET PASSWORD
  // =============================
  const handleResetPassword = (userId: string) => {
    setResettingId(userId);
    setTimeout(() => {
      setResettingId(null);
      alert('Password reset link sent');
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Admin User Management</h1>
          <p className="text-gray-500">Manage users, roles & permissions</p>
        </div>

        {/* CREATE USER FORM */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="font-semibold">Create New User</h2>

          <div className="flex gap-4">
            <Input
              placeholder="Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <select
              className="border rounded px-3"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as User['role'])}
            >
              <option value="annotator">Annotator</option>
              <option value="reviewer">Reviewer</option>
              <option value="admin">Admin</option>
            </select>

            <Button onClick={handleCreateUser}>
              <Users className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex gap-4">
          <Search className="h-5 w-5 text-gray-400 mt-2" />
          <Input
            placeholder="Search user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* USER TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="p-4">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </td>

                  <td>
                    <select
                      className="border rounded px-2 py-1"
                      value={user.role}
                      onChange={(e) =>
                        handleChangeRole(user.id, e.target.value as User['role'])
                      }
                    >
                      <option value="annotator">Annotator</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td>
                    {user.status === 'active' ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </td>

                  <td className="flex gap-2 p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetPassword(user.id)}
                      disabled={resettingId === user.id}
                    >
                      {resettingId === user.id ? (
                        <RefreshCw className="animate-spin h-4 w-4" />
                      ) : (
                        <Key className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisableUser(user.id)}
                    >
                      <Shield className="h-4 w-4 text-yellow-500" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No users found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUserManagement;
