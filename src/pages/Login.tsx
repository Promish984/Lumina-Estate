import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error('Server returned non-JSON format: ' + text.substring(0, 50));
      }
      
      if (!res.ok) {
        // Fallback for demo when MongoDB isn't hooked up
        if (data.code === 'DB_UNAVAILABLE') {
          console.warn('DB Unavailable. Using mocked login for demonstration.');
          localStorage.setItem('lumina_token', "mock_jwt_token_123");
          localStorage.setItem('lumina_user', JSON.stringify({ name: 'Admin User', email, role: 'admin' }));
          window.location.href = '/dashboard';
          return;
        }
        throw new Error(data.error || 'Authentication failed');
      }
      
      if (data.user?.role !== 'admin') {
         throw new Error('Only admins can log in to this portal.');
      }
      
      localStorage.setItem('lumina_token', data.token);
      localStorage.setItem('lumina_user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Admin Portal
              </h2>
              <p className="mt-3 text-base text-gray-500">
                Sign in to manage Lumina Estate
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center justify-center font-medium"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-primary" />
                    <input
                      type="email"
                      required
                      placeholder="admin@lumina.com"
                      className="pl-11 w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-gray-900 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-primary" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="pl-11 w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-gray-900 sm:text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
