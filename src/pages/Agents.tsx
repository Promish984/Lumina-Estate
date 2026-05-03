import { User as UserIcon, Phone, Mail, Award, Star } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const demoAgents = [
  {
    id: '1',
    name: 'Emily Davis',
    role: 'Senior Real Estate Agent',
    experience: '8+ Years',
    properties: 45,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    email: 'emily.d@lumina.com',
    phone: '+1 (555) 234-5678',
    specialties: ['Luxury Homes', 'Waterfront Properties']
  },
  {
    id: '2',
    name: 'David Wilson',
    role: 'Commercial Property Specialist',
    experience: '12+ Years',
    properties: 120,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    email: 'david.w@lumina.com',
    phone: '+1 (555) 345-6789',
    specialties: ['Office Spaces', 'Retail Outlets']
  },
  {
    id: '3',
    name: 'Jessica Chen',
    role: 'Residential Property Agent',
    experience: '5+ Years',
    properties: 30,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    email: 'jessica.c@lumina.com',
    phone: '+1 (555) 456-7890',
    specialties: ['Starter Homes', 'Apartments']
  }
];

export function Agents() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">Our Top Agents</h1>
          <p className="text-lg text-gray-500">
            Meet our team of experienced real estate professionals ready to help you find your dream property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoAgents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={agent.image} 
                  alt={agent.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 relative">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{agent.name}</h3>
                <p className="text-primary font-medium text-sm mb-4">{agent.role}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400" /> {agent.rating}</div>
                  <div className="flex items-center gap-1.5"><Award className="w-4 h-4" /> {agent.experience}</div>
                </div>

                <div className="space-y-3 mb-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{agent.email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {agent.specialties.map((spec, idx) => (
                    <span key={idx} className="bg-gray-50 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
