// // src/pages/ServerList.jsx
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { Activity, Server as ServerIcon } from 'lucide-react';

// function ServerList() {
//   const [servers, setServers] = useState({
//     data: [],
//     loading: true,
//     error: null
//   });
  
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     const fetchServers = async () => {
//       try {
//         const response = await axios.get('/api/servers');
//         setServers({
//           data: response.data.data,
//           loading: false,
//           error: null
//         });
//       } catch (error) {
//         console.error('Error fetching servers:', error);
//         setServers(prev => ({
//           ...prev,
//           loading: false,
//           error: 'Failed to load server data'
//         }));
//       }
//     };

//     fetchServers();
//   }, []);

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       online: 'bg-green-100 text-green-800',
//       offline: 'bg-red-100 text-red-800',
//       maintenance: 'bg-yellow-100 text-yellow-800'
//     };
    
//     return (
//       <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status}
//       </span>
//     );
//   };
  
//   const filteredServers = () => {
//     if (filter === 'all') return servers.data;
//     return servers.data.filter(server => server.status === filter);
//   };

//   if (servers.loading) {
//     return (
//       <div className="card flex items-center justify-center h-64">
//         <div className="text-gray-500">Loading servers...</div>
//       </div>
//     );
//   }

//   if (servers.error) {
//     return (
//       <div className="card flex items-center justify-center h-64">
//         <div className="text-red-500">{servers.error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="card">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center">
//             <ServerIcon className="h-6 w-6 text-gray-700 mr-2" />
//             <h2 className="text-xl font-semibold">Servers</h2>
//           </div>
          
//           <div className="flex space-x-2">
//             <select 
//               className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//             >
//               <option value="all">All Servers</option>
//               <option value="online">Online</option>
//               <option value="offline">Offline</option>
//               <option value="maintenance">Maintenance</option>
//             </select>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Server
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   IP Address
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Location
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Operating System
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredServers().map(server => (
//                 <tr key={server.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <Link to={`/servers/${server.id}`} className="text-blue-600 hover:text-blue-900">
//                       {server.name}
//                     </Link>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {server.ip_address}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {server.server_type}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {getStatusBadge(server.status)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {server.location}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {server.operating_system}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ServerList;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, Server as ServerIcon } from 'lucide-react';
import { useTheme } from '../components/ThemeContext'; // Assuming you have a custom hook for dark mode

function ServerList() {
  const { darkMode } = useTheme(); // Get the dark mode state
  const [servers, setServers] = useState({
    data: [],
    loading: true,
    error: null
  });
  
  const [filter, setFilter] = useState('all');

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
  
  const filteredServers = () => {
    if (filter === 'all') return servers.data;
    return servers.data.filter(server => server.status === filter);
  };

  if (servers.loading) {
    return (
      <div className={`card flex items-center justify-center h-64 ${darkMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        <div className="text-gray-500">Loading servers...</div>
      </div>
    );
  }

  if (servers.error) {
    return (
      <div className={`card flex items-center justify-center h-64 ${darkMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        <div className="text-red-500">{servers.error}</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${darkMode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
      <div className={`card`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ServerIcon className={`h-6 w-6 ${darkMode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mr-2`} />
            <h2 className="text-xl font-semibold">Servers</h2>
          </div>
          
          <div className={`flex space-x-2 ${darkMode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <select 
              className={`border ${darkMode === 'dark' ? 'border-gray-600 bg-gray-800 text-gray-200' : 'border-gray-300'} rounded-md px-3 py-1.5 text-sm`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Servers</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        
        <div className={`overflow-x-auto ${darkMode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <table className={`min-w-full divide-y  ${darkMode === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <thead className={` ${darkMode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operating System
                </th>
              </tr>
            </thead>
            <tbody className={`bg-white divide-y divide-gray-200 ${darkMode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {filteredServers().map(server => (
                <tr key={server.id} className={`hover:bg-gray-50  ${darkMode === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {server.operating_system}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ServerList;
