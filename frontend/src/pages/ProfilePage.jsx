import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, token, login } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.put(
        // Changed endpoint to match backend
        `${import.meta.env.VITE_API_URL}/api/user/update-profile`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login({ ...user, ...form, profileImage }, token);
      setSuccess('Profile updated!');
    } catch {
      setError('Update failed');
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/upload-profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setProfileImage(res.data.url);
      login({ ...user, profileImage: res.data.url }, token);
      setSuccess('Profile image updated!');
    } catch {
      setError('Image upload failed');
    }
    setUploading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Profile Image */}
        <div className="w-full md:w-1/3">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>
            
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img 
                  src={profileImage || `https://ui-avatars.com/api/?name=${form.username}&size=200`} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full object-cover border-4 border-primary-100 shadow-md transition-all" 
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer text-white font-medium text-sm px-3 py-2 rounded-full">
                    {uploading ? 'Uploading...' : 'Change Image'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImage} 
                      disabled={uploading} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
              {uploading && (
                <div className="mt-2 text-sm text-primary-600">
                  <div className="animate-pulse">Uploading image...</div>
                </div>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <h3 className="font-bold text-xl">{form.username}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{form.email}</p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Profile Form */}
        <div className="w-full md:w-2/3">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-green-700">{success}</p>
              </div>
            )}
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input 
                  name="username" 
                  value={form.username} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 transition-colors" 
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 transition-colors" 
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea 
                  name="bio" 
                  value={form.bio} 
                  onChange={handleChange} 
                  rows="4"
                  placeholder="Tell us about yourself"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 transition-colors" 
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow transition-colors focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
