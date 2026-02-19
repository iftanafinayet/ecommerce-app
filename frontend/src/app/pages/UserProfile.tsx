import { useState } from 'react';
import { User, Edit, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export function UserProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-slate-200"
    >
      <div className="flex items-center mb-6">
        <User size={32} className="text-slate-400" />
        <h1 className="ml-4 text-2xl font-bold text-slate-900">User Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="ml-auto p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          {isEditing ? <Save size={20} className="text-slate-900" /> : <Edit size={20} className="text-slate-900" />}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input 
            type="text"
            className={`w-full bg-white border ${isEditing ? 'border-slate-900' : 'border-slate-200'} rounded-lg px-4 py-2 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all`} 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input 
            type="email"
            className={`w-full bg-white border ${isEditing ? 'border-slate-900' : 'border-slate-200'} rounded-lg px-4 py-2 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all`} 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input 
              type="password"
              className={`w-full bg-white border border-slate-900 rounded-lg px-4 py-2 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all`} 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}  