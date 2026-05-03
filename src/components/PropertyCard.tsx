import { MapPin, BedDouble, Bath, SquareSigma } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../lib/utils';

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    location: string;
    price: number;
    type: string;
    bedrooms?: number;
    bathrooms?: number;
    size?: number;
    images: string[];
    status: string;
  };
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <Link to={`/properties/${property._id}`} className={cn("group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100", className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"} 
          alt={property.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
          {property.type}
        </div>
        <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-bold">
          ₹{property.price.toLocaleString('en-IN')}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>
        
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100/80">
          {property.bedrooms && (
            <div className="flex items-center text-gray-600 text-sm">
              <BedDouble className="w-4 h-4 mr-1.5 text-gray-400" />
              {property.bedrooms} Beds
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center text-gray-600 text-sm">
              <Bath className="w-4 h-4 mr-1.5 text-gray-400" />
              {property.bathrooms} Baths
            </div>
          )}
          <div className="flex items-center text-gray-600 text-sm ml-auto font-mono">
            <SquareSigma className="w-4 h-4 mr-1.5 text-gray-400" />
            {property.size?.toLocaleString()} sqft
          </div>
        </div>
      </div>
    </Link>
  );
}
