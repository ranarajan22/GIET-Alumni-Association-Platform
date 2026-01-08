import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Users } from 'lucide-react';

const TopConnections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get('http://localhost:8083/api/alumni-list?limit=5', { headers }).catch(() => ({ data: [] }));
        const data = Array.isArray(res.data) ? res.data : res.data?.alumni || [];
        setConnections(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching connections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="mx-4 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
          👥 Top Connections
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
        👥 Top Connections
      </h3>
      {connections.length === 0 ? (
        <p className="text-gray-500 text-sm">No connections found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {connections.map((person, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all text-center"
            >
              <img
                src={person.profilePhoto || 'https://via.placeholder.com/50'}
                alt={person.fullName}
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
              />
              <h4 className="font-semibold text-sm text-gray-800 truncate">
                {person.fullName}
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                {person.company || person.field || 'Alumni'}
              </p>
              <button className="w-full bg-blue-500 text-white text-xs py-2 rounded hover:bg-blue-600 transition">
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

TopConnections.propTypes = {};

export default TopConnections;
