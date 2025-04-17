// src/components/ServerTable.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ServerTable() {
  const [servers, setServers] = useState({
    data: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.get('/api/servers');
        setServers({
          data: response.data.data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching servers:', error);
        setServers(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load server data'
        }));
      }
    };

    fetchServers();
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      online: 'bg-green-100 text-green-800',
      offline: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (servers.loading) {
    return (
      <div className="dashboard-card flex items-center justify-center h-64">
        <div className="text-gray-500">Loading servers...</div>
      </div>
    );
  }

  if (servers.error) {
    return (
      <div className="dashboard-card flex items-center justify-center h-64">
        <div className="text-red-500">{servers.error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Server Status</h3>
        <Link to="/servers" className="text-sm text-blue-600 hover:text-blue-800">
          View all
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Server
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {servers.data.map(server => (
              <tr key={server.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/servers/${server.id}`} className="text-blue-600 hover:text-blue-900">
                    {server.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {server.ip_address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {server.server_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(server.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {server.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServerTable;