import { Home } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Home className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Lumina Estate</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Modern real estate platform helping you find the perfect property, whether it's residential, commercial, or plots.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 tracking-tight">Properties</h3>
            <ul className="space-y-3">
              <li><Link to="/properties?type=Residential" className="text-gray-500 hover:text-primary text-sm transition-colors">Residential</Link></li>
              <li><Link to="/properties?type=Commercial" className="text-gray-500 hover:text-primary text-sm transition-colors">Commercial</Link></li>
              <li><Link to="/properties?type=Plots" className="text-gray-500 hover:text-primary text-sm transition-colors">Plots & Land</Link></li>
              <li><Link to="/properties" className="text-gray-500 hover:text-primary text-sm transition-colors">All Listings</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 tracking-tight">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Contact</a></li>
              <li><Link to="/agents" className="text-gray-500 hover:text-primary text-sm transition-colors">Our Agents</Link></li>
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 tracking-tight">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 text-center md:flex md:justify-between md:text-left">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Lumina Real Estate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
