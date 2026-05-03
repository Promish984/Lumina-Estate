import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { mockProperties } from '../../lib/mockData';

export function AdminProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', location: '', price: '', type: 'Residential', size: '', status: 'Available'
  });

  const fetchProperties = () => {
    setLoading(true);
    fetch('/api/properties')
      .then(async res => {
        if (!res.ok) throw new Error('DB Unavailable');
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
        setProperties(mockProperties);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (prop: any) => {
    setEditingId(prop._id);
    setFormData({
      title: prop.title,
      location: prop.location,
      price: prop.price.toString(),
      type: prop.type,
      size: prop.size?.toString() || '',
      status: prop.status || 'Available'
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, isMock: boolean) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    if (isMock) {
      setProperties(prev => prev.filter(p => p._id !== id));
      return;
    }

    try {
      const token = localStorage.getItem('lumina_token');
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProperties();
      } else {
        let errMessage = 'Failed to delete property';
        if (res.headers.get("content-type")?.includes("application/json")) {
           const data = await res.json();
           errMessage = data.error || errMessage;
        }
        alert(`Error: ${errMessage}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('lumina_token');
    
    // For local mock demonstration
    const isMockData = properties === mockProperties || properties.length > 0 && properties[0]._id === '1';

    const payload = {
      ...formData,
      price: Number(formData.price),
      size: formData.size ? Number(formData.size) : undefined,
      images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"]
    };

    if (isMockData && !localStorage.getItem('lumina_token')?.startsWith('eyJ')) {
        // Just update local state since DB isn't running properly
        if (editingId) {
            setProperties(prev => prev.map(p => p._id === editingId ? { ...p, ...payload } : p));
        } else {
            setProperties(prev => [...prev, { ...payload, _id: Date.now().toString() }]);
        }
        setShowForm(false);
        setEditingId(null);
        return;
    }

    try {
      const url = editingId ? `/api/properties/${editingId}` : '/api/properties';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        fetchProperties();
        setShowForm(false);
        setEditingId(null);
        setFormData({ title: '', location: '', price: '', type: 'Residential', size: '', status: 'Available' });
      } else {
        let errMessage = 'Failed to save property';
        if (res.headers.get("content-type")?.includes("application/json")) {
           const data = await res.json();
           errMessage = data.error || errMessage;
        }
        alert(`Error: ${errMessage}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading properties...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 text-lg">Manage Properties</h3>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', location: '', price: '', type: 'Residential', size: '', status: 'Available' });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Property'}
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required name="title" value={formData.title} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input required name="location" value={formData.location} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input required name="price" value={formData.price} onChange={handleInputChange} type="number" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size (sqft)</label>
                <input name="size" value={formData.size} onChange={handleInputChange} type="number" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary">
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Plots">Plots & Land</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary">
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors">
              {editingId ? 'Save Changes' : 'Create Property'}
            </button>
          </form>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {properties.map((prop, idx) => {
          const isMock = prop._id.length < 10; // Simple check for mock ID vs Mongo ID
          return (
            <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <img src={prop.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"} alt="" className="w-16 h-12 rounded object-cover" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{prop.title}</h4>
                  <p className="text-gray-500 text-xs">{prop.location} • ₹{prop.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold mr-4">
                  {prop.status}
                </span>
                <button onClick={() => handleEdit(prop)} className="p-2 text-gray-400 hover:text-primary bg-white shadow-sm border border-gray-100 rounded-md transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(prop._id, isMock)} className="p-2 text-gray-400 hover:text-red-500 bg-white shadow-sm border border-gray-100 rounded-md transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {properties.length === 0 && (
          <div className="p-8 text-center text-gray-500">No properties found.</div>
        )}
      </div>
    </div>
  );
}
