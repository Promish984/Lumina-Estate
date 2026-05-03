import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { PropertyCard } from '../components/PropertyCard';
import { mockProperties } from '../lib/mockData';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

export function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const typeParam = searchParams.get('type') || '';
  const searchLocation = searchParams.get('location') || '';

  useEffect(() => {
    setLoading(true);
    // Build query string
    const urlParams = new URLSearchParams();
    if (typeParam) urlParams.append('type', typeParam);
    if (searchLocation) urlParams.append('location', searchLocation);
    
    fetch(`/api/properties?${urlParams.toString()}`)
      .then(async res => {
        if (!res.ok) throw new Error('API unavailable');
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error('API returned HTML');
        }
        return res.json();
      })
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => {
        console.warn('Using mock data');
        // Filter mock data locally
        let filtered = mockProperties;
        if (typeParam) filtered = filtered.filter(p => p.type === typeParam);
        if (searchLocation) filtered = filtered.filter(p => p.location.toLowerCase().includes(searchLocation.toLowerCase()));
        setProperties(filtered);
        setLoading(false);
      });
  }, [typeParam, searchLocation]);

  const updateSearch = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Property Listings</h1>
        <p className="text-gray-500 mt-2">Find your perfect place from our wide selection of properties.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-gray-900 pb-4 border-b border-gray-100">
              <SlidersHorizontal className="w-5 h-5" />
              <h2 className="font-semibold text-lg">Filters</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="City, Area" 
                    value={searchLocation}
                    onChange={(e) => updateSearch('location', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                  />
                  <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select 
                  value={typeParam}
                  onChange={(e) => updateSearch('type', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                >
                  <option value="">All Types</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Plots">Plots & Land</option>
                </select>
              </div>
              
              <button 
                onClick={() => setSearchParams({})}
                className="w-full text-center text-sm text-gray-500 hover:text-primary transition-colors py-2"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>

        {/* Listings Result */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map((sk) => (
                <div key={sk} className="bg-gray-100 animate-pulse rounded-2xl h-80"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((prop, i) => (
                <motion.div
                  key={prop._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <PropertyCard property={prop} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
