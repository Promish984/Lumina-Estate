import { useState } from 'react';
import { Pencil, Trash2, Mail, Shield, ShieldAlert, Check } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@lumina.com', role: 'admin', status: 'active', joined: '2023-01-15' },
  { id: '2', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joined: '2023-03-22' },
  { id: '3', name: 'Sarah Smith', email: 'sarah.agent@example.com', role: 'agent', status: 'inactive', joined: '2023-05-10' },
  { id: '4', name: 'Michael Brown', email: 'michael@domain.com', role: 'user', status: 'active', joined: '2023-06-01' },
  { id: '5', name: 'Emily Davis', email: 'emily.d@lumina.com', role: 'agent', status: 'active', joined: '2023-07-15' },
  { id: '6', name: 'David Wilson', email: 'david.w@lumina.com', role: 'agent', status: 'active', joined: '2023-06-20' },
  { id: '7', name: 'Jessica Chen', email: 'jessica.c@lumina.com', role: 'agent', status: 'active', joined: '2023-08-05' },
];

export function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleRoleChange = (id: string, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Manage Users</h2>
        <div className="text-sm text-gray-500">
          Showing {users.length} users (Mock Data)
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-gray-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'agent' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        <span className="capitalize">{user.role}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <select 
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="capitalize">{user.status}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === user.id ? (
                        <button 
                          onClick={() => setEditingId(null)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Save changes"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => setEditingId(user.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                        title={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1 ? 'Cannot delete last admin' : 'Delete user'}
                      >
                        <Trash2 className={`w-4 h-4 ${user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1 ? 'opacity-50' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
