import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LayoutDashboard, LogOut, Home, Users, CalendarDays, Settings, ShieldAlert, Building } from 'lucide-react';
import { mockProperties } from '../lib/mockData';
import { AdminProperties } from '../components/admin/AdminProperties';
import { AdminUsers } from '../components/admin/AdminUsers';

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const saved = localStorage.getItem('lumina_user');
    if (!saved) {
      navigate('/login');
    } else {
      setUser(JSON.parse(saved));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('lumina_token');
    localStorage.removeItem('lumina_user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <LayoutDashboard className="text-primary w-5 h-5" />
            Dashboard
          </h2>
        </div>
        <div className="flex-1 py-6">
          <nav className="space-y-1 px-3">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Home className={`w-5 h-5 ${activeTab === 'overview' ? '' : 'text-gray-400'}`} /> Overview
            </button>
            {user.role === 'admin' && (
              <>
                <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Users className={`w-5 h-5 ${activeTab === 'users' ? '' : 'text-gray-400'}`} /> Manage Users
                </button>
                <button onClick={() => setActiveTab('properties')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'properties' ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Building className={`w-5 h-5 ${activeTab === 'properties' ? '' : 'text-gray-400'}`} /> Manage Properties
                </button>
              </>
            )}
            <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
              <CalendarDays className={`w-5 h-5 ${activeTab === 'bookings' ? '' : 'text-gray-400'}`} /> Bookings
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Settings className={`w-5 h-5 ${activeTab === 'settings' ? '' : 'text-gray-400'}`} /> Settings
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        {activeTab === 'overview' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                <p className="text-gray-500">Here's what's happening with your account today.</p>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700 capitalize">{user.role} Account</span>
              </div>
            </div>

            {/* Admin Alerts */}
            {user.role === 'admin' && (
              <div className="mb-8 bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
                 <ShieldAlert className="text-amber-500 flex-shrink-0" />
                 <div>
                   <h3 className="font-semibold text-amber-800">Admin Mode Active</h3>
                   <p className="text-amber-700 text-sm mt-1">You have full access to manage users, properties, and system settings. Connect MONGODB_URI in secrets for full functionality.</p>
                 </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium mb-1">Total Properties</div>
                <div className="text-3xl font-bold text-gray-900">
                  {user.role === 'user' ? '0' : mockProperties.length}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium mb-1">Active Bookings</div>
                <div className="text-3xl font-bold text-gray-900">
                  {user.role === 'user' ? '1' : '14'}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium mb-1">New Messages</div>
                <div className="text-3xl font-bold text-gray-900">3</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900 text-lg">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-100">
                 {user.role === 'admin' || user.role === 'agent' ? (
                   mockProperties.slice(0, 3).map((prop, idx) => (
                     <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-4">
                         <img src={prop.images[0]} alt="" className="w-16 h-12 rounded object-cover" />
                         <div>
                           <h4 className="font-semibold text-gray-900 text-sm">{prop.title}</h4>
                           <p className="text-gray-500 text-sm">Listed ₹{prop.price.toLocaleString('en-IN')}</p>
                         </div>
                       </div>
                       <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Active</div>
                     </div>
                   ))
                 ) : (
                   <div className="p-6 flex flex-col items-center justify-center text-center py-12">
                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                       <CalendarDays className="w-8 h-8 text-gray-300" />
                     </div>
                     <h4 className="font-medium text-gray-900 mb-1">No bookings yet</h4>
                     <p className="text-gray-500 text-sm">When you book a property tour, it will appear here.</p>
                   </div>
                 )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && user.role === 'admin' && (
          <AdminUsers />
        )}

        {activeTab === 'properties' && user.role === 'admin' && (
          <AdminProperties />
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Bookings</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {[
                  { id: '1', title: 'Modern Skyline Apartment', date: 'May 10, 2026', time: '10:00 AM', status: 'Upcoming' },
                  { id: '2', title: 'Luxury Villa in South Delhi', date: 'May 12, 2026', time: '02:00 PM', status: 'Upcoming' },
                  { id: '3', title: 'Seaside Penthouse', date: 'April 20, 2026', time: '11:00 AM', status: 'Completed' }
                ].map((booking) => (
                  <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <CalendarDays className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{booking.title}</h4>
                        <p className="text-gray-500 text-sm mt-0.5">{booking.date} at {booking.time}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500">Settings configuration will appear here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
