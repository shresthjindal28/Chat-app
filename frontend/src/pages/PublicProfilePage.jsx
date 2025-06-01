import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProfile(res.data));
  }, [userId, token]);

  if (!profile) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <img src={profile.profileImage || `https://ui-avatars.com/api/?name=${profile.username}`} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{profile.username}</h2>
        <p className="mb-2 text-dark-600 dark:text-dark-400">{profile.bio}</p>
        <Link to={`/chat`} className="mt-4 inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">Start Chat</Link>
      </div>
    </div>
  );
};

export default PublicProfilePage;
