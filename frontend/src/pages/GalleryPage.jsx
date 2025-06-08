import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const GalleryPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchImages();
  }, [token, navigate]);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/images`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImages(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load images');
    }
  };

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
    }

    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateFile(file);
      setUploading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('image', file);
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/images`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      await fetchImages();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (url) => {
    try {
      const id = url.split('/').pop().split('.')[0];
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/images/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImages(images.filter(img => img !== url));
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">My Gallery</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="mb-4">
        <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((url, i) => (
          <div key={i} className="relative group">
            <img 
              src={url} 
              alt={`Gallery image ${i + 1}`} 
              className="rounded-lg w-40 h-40 object-cover"
              loading="lazy"
            />
            <button
              onClick={() => handleDelete(url)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
// No changes needed here for the frontend.
