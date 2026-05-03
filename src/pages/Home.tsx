import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Building2, MapPin, BuildingIcon, Trees } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { mockProperties } from '../lib/mockData';
import { motion } from 'motion/react';

export function Home() {
  const [properties, setProperties] = useState<any[]>(mockProperties);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/properties')
      .then(async res => {
        if (!res.ok) throw new Error('API unavailable');
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error('API returned HTML');
        }
        return res.json();
      })
      .then(data => setProperties(data.slice(0, 3)))
      .catch((err) => {
        console.warn('Using mock data due to:', err.message);
        setProperties(mockProperties.slice(0, 3));
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.append('location', searchLocation);
    if (searchType) params.append('type', searchType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Real Estate" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/60" />
        </div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Find Your Dream <span className="text-primary-light">Property</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
          >
            Discover premium residential, commercial, and land properties tailored to your lifestyle.
          </motion.p>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSearch} 
            className="bg-white p-3 md:p-4 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-3 max-w-4xl mx-auto"
          >
            <div className="flex-1 flex gap-3 flex-col md:flex-row">
              <div className="flex-1 relative flex items-center bg-gray-50 rounded-full px-4 py-3 md:py-0 border border-transparent focus-within:border-primary/30 transition-colors">
                <MapPin className="text-gray-400 w-5 h-5 mr-2" />
                <input 
                  type="text" 
                  placeholder="Location or City" 
                  className="bg-transparent border-none outline-none w-full text-gray-700"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <div className="flex-1 relative flex items-center bg-gray-50 rounded-full px-4 py-3 md:py-0 border border-transparent focus-within:border-primary/30 transition-colors">
                <Building2 className="text-gray-400 w-5 h-5 mr-2" />
                <select 
                  className="bg-transparent border-none outline-none w-full text-gray-700 appearance-none"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="">Any Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Plots">Plots & Land</option>
                </select>
              </div>
            </div>
            <button type="submit" className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-3 md:py-4 font-semibold transition-colors flex items-center justify-center shadow-lg shadow-primary/30 md:w-auto w-full">
              <Search className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Search</span>
            </button>
          </motion.form>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Explore Categories</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Browse our diverse portfolio of properties designed to meet your specific needs and preferences.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Residential', icon: Building2, desc: 'Find your perfect family home or modern apartment.', link: '/properties?type=Residential' },
              { name: 'Commercial', icon: BuildingIcon, desc: 'Premium office spaces and retail locations for your business.', link: '/properties?type=Commercial' },
              { name: 'Plots & Land', icon: Trees, desc: 'Build your dream project from the ground up.', link: '/properties?type=Plots' }
            ].map((cat, idx) => (
              <Link to={cat.link} key={idx} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md border border-gray-100 transition-all group">
                <div className="w-16 h-16 bg-primary-light text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Featured Properties</h2>
              <p className="text-gray-500">Hand-picked properties for you</p>
            </div>
            <Link to="/properties" className="hidden md:flex text-primary hover:text-primary-hover font-medium items-center transition-colors">
              View all listings &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop, i) => (
              <motion.div
                key={prop._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link to="/properties" className="text-primary font-medium hover:underline">
              View all listings &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
