import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { mockProperties } from '../lib/mockData';
import { MapPin, BedDouble, Bath, SquareSigma, Calendar, Phone, Mail, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then(async res => {
        if (!res.ok) throw new Error('API unavailable');
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error('API returned HTML');
        }
        return res.json();
      })
      .then(data => {
        setProperty(data);
        setLoading(false);
      })
      .catch(() => {
        console.warn('Using mock data for details');
        const found = mockProperties.find(p => p._id === id);
        setProperty(found || null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-20 text-center text-gray-500 animate-pulse">Loading property details...</div>;
  if (!property) return <div className="p-20 text-center text-xl text-gray-700">Property not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{property.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          {/* Main Image */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[16/9] md:aspect-[2/1] bg-gray-100 rounded-3xl overflow-hidden mb-8"
          >
            <img 
              src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Details Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">₹{property.price.toLocaleString('en-IN')}</div>
                <div className="text-gray-500">{property.type}</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 py-6 border-y border-gray-100 mb-8 overflow-x-auto">
              {property.bedrooms && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-full text-gray-500"><BedDouble size={20} /></div>
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-semibold text-gray-900 leading-none">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
                  <div className="p-3 bg-gray-50 rounded-full text-gray-500"><Bath size={20} /></div>
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-semibold text-gray-900 leading-none">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              {property.size && (
                <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
                  <div className="p-3 bg-gray-50 rounded-full text-gray-500"><SquareSigma size={20} /></div>
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-semibold text-gray-900 leading-none">{property.size.toLocaleString()} sqft</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Property Description</h2>
            <div className="prose text-gray-600 max-w-none leading-relaxed mb-8">
              {property.description ? <p>{property.description}</p> : <p>Experience luxury living in this exceptional {property.type.toLowerCase()} property located in the heart of {property.location}. Featuring high-end finishes, abundant natural light, and premium amenities designed for modern comfort.</p>}
            </div>

            {/* Amenities */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 mb-8">
              {property.amenities && property.amenities.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
          {/* Agent Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-4">Listed By</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <UserIcon size={32} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{property.agentId?.name || "Sarah Jenkins"}</h4>
                <p className="text-gray-500 text-sm">Senior Real Estate Agent</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors text-sm">
                <Phone size={16} /> +1 (555) 123-4567
              </a>
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors text-sm">
                <Mail size={16} /> {property.agentId?.email || "sarah@luminaestate.com"}
              </a>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Book a Visit</h3>
            <p className="text-sm text-gray-500 mb-6">Schedule a tour with the agent to view this property.</p>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Booking requested!'); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <input type="date" required className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Preference</label>
                <select required className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                  <option value="Morning">Morning (9AM - 12PM)</option>
                  <option value="Afternoon">Afternoon (1PM - 4PM)</option>
                  <option value="Evening">Evening (5PM - 7PM)</option>
                </select>
              </div>
              <button className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg shadow-sm transition-all mt-4">
                Request Tour
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
