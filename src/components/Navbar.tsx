import { Link } from 'react-router';
import { Home, User, Menu, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lumina_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-white p-2 rounded-lg group-hover:bg-primary-hover transition-colors">
                <Home className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-primary transition-colors">Lumina Estate</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/properties" className="text-gray-600 hover:text-primary font-medium transition-colors">Properties</Link>
            <Link to="/agents" className="text-gray-600 hover:text-primary font-medium transition-colors">Agents</Link>
            <div className="h-6 w-px bg-gray-200"></div>
            {user ? (
              <Link to="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-primary font-medium transition-colors">
                  <User className="w-4 h-4" />
                  Sign in
                </Link>
                <Link to="/login" className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm">
                  List Property
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/properties" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary bg-gray-50 rounded-md">Properties</Link>
            <Link to="/agents" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary bg-gray-50 rounded-md">Agents</Link>
            {user ? (
              <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-primary bg-gray-50 rounded-md">Dashboard</Link>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary bg-gray-50 rounded-md">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
