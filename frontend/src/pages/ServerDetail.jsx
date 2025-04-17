// // src/pages/ServerDetail.jsx
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { AlertCircle, Activity, TrendingUp} from 'lucide-react';

// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
//   Title, Tooltip, Legend, TimeScale
// } from 'chart.js';
// import { format, parseISO } from 'date-fns';

// ChartJS.register(
//   CategoryScale, LinearScale, PointElement, LineElement,
//   Title, Tooltip, Legend, TimeScale
// );

// function ServerDetail() {
//   const { id } = useParams();
//   const [server, setServer] = useState(null);
//   const [metrics, setMetrics] = useState([]);
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [range, setRange] = useState(24); // Last N hours

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const [serverRes, metricRes, alertRes] = await Promise.all([
//           axios.get(`/api/servers/${id}`),
//           axios.get(`/api/metrics/${id}?hours=${range}`),
//           axios.get(`/api/alerts/server/${id}`)
//         ]);
//         setServer(serverRes.data.data);
//         setMetrics(metricRes.data.data);
//         setAlerts(alertRes.data.data);
//         console.log(metricRes.data.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [id, range]);

//   const getChartData = () => {
//     const labels = metrics.map(m => format(parseISO(m.timestamp), 'HH:mm'));
//     return {
//       labels,
//       datasets: [
//         {
//           label: 'CPU Usage (%)',
//           data: metrics.map(m => m.cpu_usage),
//           borderColor: '#3b82f6',
//           backgroundColor: 'rgba(59, 130, 246, 0.2)',
//           tension: 0.4
//         },
//         {
//           label: 'RAM Usage (%)',
//           data: metrics.map(m => m.ram_usage),
//           borderColor: '#8b5cf6',
//           backgroundColor: 'rgba(139, 92, 246, 0.2)',
//           tension: 0.4
//         },
//         {
//           label: 'Disk Usage (%)',
//           data: metrics.map(m => m.disk_usage),
//           borderColor: '#10b981',
//           backgroundColor: 'rgba(16, 185, 129, 0.2)',
//           tension: 0.4
//         }
//       ]
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: false }
//     },
//     maintainAspectRatio: false
//   };

//   if (loading || !server) {
//     return (
//       <div className="dashboard-card flex items-center justify-center h-64">
//         <div className="text-gray-500">Loading server data...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="dashboard-card">
//         <h2 className="text-xl font-semibold mb-2 flex items-center">
//           <Activity className="w-5 h-5 mr-2" /> {server.name}
//         </h2>
//         <p className="text-sm text-gray-600">Type: {server.server_type}</p>
//         <p className="text-sm text-gray-600">IP: {server.ip_address}</p>
//         <p className="text-sm text-gray-600">Location: {server.location}</p>
//         <p className="text-sm text-gray-600">Status: <span className="font-semibold capitalize">{server.status}</span></p>
//       </div>

//       <div className="dashboard-card">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <TrendingUp className="h-5 w-5 text-gray-700 mr-2" />
//             <h3 className="text-lg font-medium">Resource Usage</h3>
//           </div>
//           <select
//             value={range}
//             onChange={(e) => setRange(e.target.value)}
//             className="text-sm border border-gray-300 rounded-md px-2 py-1"
//           >
//             <option value="6">Last 6 hours</option>
//             <option value="12">Last 12 hours</option>
//             <option value="24">Last 24 hours</option>
//           </select>
//         </div>
//         <div className="h-64">
//           <Line data={getChartData()} options={chartOptions} />
//         </div>
//       </div>

//       <div className="dashboard-card">
//         <div className="flex items-center mb-4">
//           <AlertCircle className="h-5 w-5 text-gray-700 mr-2" />
//           <h3 className="text-lg font-medium">Recent Alerts</h3>
//         </div>
//         {alerts.length === 0 ? (
//           <div className="text-gray-500">No alerts found.</div>
//         ) : (
//           <ul className="space-y-2 ">
//             {alerts.map(alert => (
//               <li key={alert.id} className="bg-white p-2 rounded-md text-sm text-gray-700">
//                 <span className={`font-medium ${
//     alert.severity === 'critical'
//       ? 'bg-red-100 text-red-700'
//       : alert.severity === 'medium'
//       ? 'bg-yellow-100 text-yellow-700'
//       : alert.severity === 'low'
//       ? 'bg-green-100 text-green-700'
//       : 'bg-gray-100 text-gray-600'
//   }`}>
//   {(alert.severity
//  || 'unknown').toUpperCase()}
// </span> – {alert.message} <span className="text-gray-500 text-xs">({format(parseISO(alert.timestamp), 'PPpp')})</span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ServerDetail;


// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { AlertCircle, Activity, TrendingUp} from 'lucide-react';

// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
//   Title, Tooltip, Legend, TimeScale
// } from 'chart.js';
// import { format, parseISO } from 'date-fns';

// ChartJS.register(
//   CategoryScale, LinearScale, PointElement, LineElement,
//   Title, Tooltip, Legend, TimeScale
// );

// function ServerDetail() {
//   const { id } = useParams();
//   const [server, setServer] = useState(null);
//   const [metrics, setMetrics] = useState([]);
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [range, setRange] = useState(24); // Default to last 24 hours

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const [serverRes, metricRes, alertRes] = await Promise.all([
//           axios.get(`/api/servers/${id}`),
//           axios.get(`/api/metrics/${id}?hours=${range}`),
//           axios.get(`/api/alerts/server/${id}`)
//         ]);
//         setServer(serverRes.data.data);
//         setMetrics(metricRes.data.data);
//         setAlerts(alertRes.data.data);
//         console.log(metricRes.data.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [id, range]);

//   const getChartData = () => {
//     const labels = metrics.map(m => format(parseISO(m.timestamp), 'HH:mm'));
//     return {
//       labels,
//       datasets: [
//         {
//           label: 'CPU Usage (%)',
//           data: metrics.map(m => m.cpu_usage),
//           borderColor: '#3b82f6',
//           backgroundColor: 'rgba(59, 130, 246, 0.2)',
//           tension: 0.4
//         },
//         {
//           label: 'RAM Usage (%)',
//           data: metrics.map(m => m.ram_usage),
//           borderColor: '#8b5cf6',
//           backgroundColor: 'rgba(139, 92, 246, 0.2)',
//           tension: 0.4
//         },
//         {
//           label: 'Disk Usage (%)',
//           data: metrics.map(m => m.disk_usage),
//           borderColor: '#10b981',
//           backgroundColor: 'rgba(16, 185, 129, 0.2)',
//           tension: 0.4
//         }
//       ]
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: false }
//     },
//     maintainAspectRatio: false
//   };

//   if (loading || !server) {
//     return (
//       <div className="dashboard-card flex items-center justify-center h-64">
//         <div className="text-gray-500">Loading server data...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="dashboard-card">
//         <h2 className="text-xl font-semibold mb-2 flex items-center">
//           <Activity className="w-5 h-5 mr-2" /> {server.name}
//         </h2>
//         <p className="text-sm text-gray-600">Type: {server.server_type}</p>
//         <p className="text-sm text-gray-600">IP: {server.ip_address}</p>
//         <p className="text-sm text-gray-600">Location: {server.location}</p>
//         <p className="text-sm text-gray-600">Status: <span className="font-semibold capitalize">{server.status}</span></p>
//       </div>

//       <div className="dashboard-card">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <TrendingUp className="h-5 w-5 text-gray-700 mr-2" />
//             <h3 className="text-lg font-medium">Resource Usage</h3>
//           </div>
//           <select
//             value={range}
//             onChange={(e) => setRange(e.target.value)}
//             className="text-sm border border-gray-300 rounded-md px-2 py-1"
//           >
//             <option value="6">Last 6 hours</option>
//             <option value="12">Last 12 hours</option>
//             <option value="24">Last 24 hours</option>
//             <option value="0">All Time</option> {/* New option for All Time */}
//           </select>
//         </div>
//         <div className="h-64">
//           <Line data={getChartData()} options={chartOptions} />
//         </div>
//       </div>

//       <div className="dashboard-card">
//         <div className="flex items-center mb-4">
//           <AlertCircle className="h-5 w-5 text-gray-700 mr-2" />
//           <h3 className="text-lg font-medium">Recent Alerts</h3>
//         </div>
//         {alerts.length === 0 ? (
//           <div className="text-gray-500">No alerts found.</div>
//         ) : (
          // <ul className="space-y-2">
          //   {alerts.map(alert => (
          //     <li key={alert.id} className="bg-white p-2 rounded-md text-sm text-gray-700">
          //       <span className={`font-medium ${
          //         alert.severity === 'critical'
          //           ? 'bg-red-100 text-red-700'
          //           : alert.severity === 'medium'
          //           ? 'bg-yellow-100 text-yellow-700'
          //           : alert.severity === 'low'
          //           ? 'bg-green-100 text-green-700'
          //           : 'bg-gray-100 text-gray-600'
          //       }`}>
          //         {(alert.severity || 'unknown').toUpperCase()}
          //       </span> – {alert.message} <span className="text-gray-500 text-xs">({format(parseISO(alert.timestamp), 'PPpp')})</span>
          //     </li>
          //   ))}
          // </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ServerDetail;

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Activity, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, TimeScale
} from 'chart.js';
import { format, parseISO } from 'date-fns';
import { useTheme } from '../components/ThemeContext'; // Assuming you have a custom hook for dark mode

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, TimeScale
);

function ServerDetail() {
  const { darkMode } = useTheme(); // Get the dark mode state
  const { id } = useParams();
  const [server, setServer] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(24); // Default to last 24 hours

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [serverRes, metricRes, alertRes] = await Promise.all([
          axios.get(`/api/servers/${id}`),
          axios.get(`/api/metrics/${id}?hours=${range}`),
          axios.get(`/api/alerts/server/${id}`)
        ]);
        setServer(serverRes.data.data);
        setMetrics(metricRes.data.data);
        setAlerts(alertRes.data.data);
        console.log(metricRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, range]);

  const getChartData = () => {
    const labels = metrics.map(m => format(parseISO(m.timestamp), 'HH:mm'));
    return {
      labels,
      datasets: [
        {
          label: 'CPU Usage (%)',
          data: metrics.map(m => m.cpu_usage),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.4
        },
        {
          label: 'RAM Usage (%)',
          data: metrics.map(m => m.ram_usage),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          tension: 0.4
        },
        {
          label: 'Disk Usage (%)',
          data: metrics.map(m => m.disk_usage),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
    maintainAspectRatio: false
  };

  if (loading || !server) {
    return (
      <div className={`dashboard-card flex items-center justify-center h-64 ${darkMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        <div className="text-gray-500">Loading server data...</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${darkMode === 'dark' ? ' text-gray-100' : ' text-gray-900'}`}>
      <div className="dashboard-card">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <Activity className={`w-5 h-5 mr-2 ${darkMode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} /> {server.name}
        </h2>
        <p className="text-sm">Type: {server.server_type}</p>
        <p className="text-sm">IP: {server.ip_address}</p>
        <p className="text-sm">Location: {server.location}</p>
        <p className="text-sm">Status: <span className="font-semibold capitalize">{server.status}</span></p>
      </div>

      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className={`h-5 w-5 ${darkMode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mr-2`} />
            <h3 className="text-lg font-medium">Resource Usage</h3>
          </div>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className={`text-sm border ${darkMode === 'dark' ? 'border-gray-600 bg-gray-800 text-gray-200' : 'border-gray-300'} rounded-md px-2 py-1`}
          >
            <option value="6">Last 6 hours</option>
            <option value="12">Last 12 hours</option>
            <option value="24">Last 24 hours</option>
            <option value="0">All Time</option> {/* New option for All Time */}
          </select>
        </div>
        <div className="h-64">
          <Line data={getChartData()} options={chartOptions} />
        </div>
      </div>

      <div className="dashboard-card">
        <div className="flex items-center mb-4">
          <AlertCircle className={`h-5 w-5 ${darkMode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mr-2`} />
          <h3 className="text-lg font-medium">Recent Alerts</h3>
        </div>
        {alerts.length === 0 ? (
          <div className="text-gray-500">No alerts found.</div>
        ) : (
          <ul className="space-y-2">
            {alerts.map(alert => (
              <li key={alert.id} className="bg-white p-2 rounded-md text-sm text-gray-700">
                <span className={`font-medium ${
                  alert.severity === 'critical'
                    ? 'bg-red-100 text-red-700'
                    : alert.severity === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : alert.severity === 'low'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {(alert.severity || 'unknown').toUpperCase()}
                </span> – {alert.message} <span className="text-gray-500 text-xs">({format(parseISO(alert.timestamp), 'PPpp')})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ServerDetail;
