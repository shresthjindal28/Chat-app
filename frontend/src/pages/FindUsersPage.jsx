import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const FindUsersPage = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/chat/peers`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));
  }, [token]);

  const filtered = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-dark-900">
      <h2 className="text-2xl font-bold mb-4">Find Users</h2>
      <div className="w-full max-w-md mb-4">
        <input
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
          placeholder="Search by username"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-dark-400">No users found.</div>
        ) : (
          filtered.map(u => (
            <Link to={`/users/${u._id}`} key={u._id} className="card flex items-center gap-2 p-4 rounded shadow hover:bg-primary-50 dark:hover:bg-dark-800 transition hover-effect">
              <img src={u.profileImage || `https://ui-avatars.com/api/?name=${u.username}`} alt="" className="w-10 h-10 rounded-full" />
              <span className="font-medium">{u.username}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default FindUsersPage;
