// // src/components/NetworkTraffic.jsx
// import { useState, useEffect } from 'react';
// import { TrendingUp } from 'lucide-react';
// import axios from 'axios';
// import { 
//   Chart as ChartJS, 
//   CategoryScale, 
//   LinearScale, 
//   PointElement, 
//   LineElement, 
//   Title, 
//   Tooltip, 
//   Legend,
//   TimeScale
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import { format, parseISO } from 'date-fns';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   TimeScale
// );

// function NetworkTraffic() {
//   const [trafficData, setTrafficData] = useState({
//     data: [],
//     loading: true,
//     error: null
//   });

//   useEffect(() => {
//     const fetchNetworkTraffic = async () => {
//       try {
//         const response = await axios.get('/api/network/traffic');
//         setTrafficData({
//           data: response.data.data,
//           loading: false,
//           error: null
//         });
//       } catch (error) {
//         console.error('Error fetching network traffic:', error);
//         setTrafficData(prev => ({
//           ...prev,
//           loading: false,
//           error: 'Failed to load network traffic data'
//         }));
//       }
//     };

//     fetchNetworkTraffic();
    
//     // Refresh every minute
//     const interval = setInterval(fetchNetworkTraffic, 60000);
    
//     return () => clearInterval(interval);
//   }, []);

//   const formatData = () => {
//     if (!trafficData.data || trafficData.data.length === 0) {
//       return {
//         labels: [],
//         datasets: []
//       };
//     }
    
//     const labels = trafficData.data.map(item => 
//       format(parseISO(item.timestamp), 'HH:mm')
//     );
    
//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Network In (MB/s)',
//           data: trafficData.data.map(item => item.network_in),
//           borderColor: '#3b82f6',
//           backgroundColor: 'rgba(59, 130, 246, 0.5)',
//           tension: 0.4
//         },
//         {
//           label: 'Network Out (MB/s)',
//           data: trafficData.data.map(item => item.network_out),
//           borderColor: '#10b981',
//           backgroundColor: 'rgba(16, 185, 129, 0.5)',
//           tension: 0.4
//         }
//       ]
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'MB/s'
//         }
//       },
//       x: {
//         title: {
//           display: true,
//           text: 'Time'
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: false
//       }
//     },
//     maintainAspectRatio: false
//   };

//   if (trafficData.loading) {
//     return (
//       <div className="dashboard-card flex items-center justify-center h-64">
//         <div className="text-gray-500">Loading network traffic data...</div>
//       </div>
//     );
//   }

//   if (trafficData.error) {
//     return (
//       <div className="dashboard-card flex items-center justify-center h-64">
//         <div className="text-red-500">{trafficData.error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-card">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center">
//           <TrendingUp className="h-5 w-5 text-gray-700 mr-2" />
//           <h3 className="text-lg font-medium">Network Traffic</h3>
//         </div>
        
//         <select 
//           className="text-sm border border-gray-300 rounded-md px-2 py-1"
//           defaultValue="24"
//         >
//           <option value="6">Last 6 hours</option>
//           <option value="12">Last 12 hours</option>
//           <option value="24">Last 24 hours</option>
//         </select>
//       </div>
      
//       <div className="h-64">
//         <Line data={formatData()} options={chartOptions} />
//       </div>
//     </div>
//   );
// }

// export default NetworkTraffic;


import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { useTheme } from '../components/ThemeContext'; // Assuming you have a custom hook for dark mode

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function NetworkTraffic() {
  const { darkMode } = useTheme(); // Getting dark mode state
  const [selectedHours, setSelectedHours] = useState('all');
  const [trafficData, setTrafficData] = useState({
    data: [],
    loading: true,
    error: null
  });

  const fetchNetworkTraffic = async (hours) => {
    try {
      const params = {};
      if (hours !== 'all') {
        params.hours = hours;
      }

      const response = await axios.get('/api/network/traffic', { params });

      setTrafficData({
        data: response.data.data,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching network traffic:', error);
      setTrafficData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load network traffic data'
      }));
    }
  };

  useEffect(() => {
    fetchNetworkTraffic(selectedHours);

    const interval = setInterval(() => {
      fetchNetworkTraffic(selectedHours);
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedHours]);

  const formatData = () => {
    if (!trafficData.data || trafficData.data.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = trafficData.data.map(item =>
      format(parseISO(item.timestamp), 'HH:mm')
    );

    return {
      labels,
      datasets: [
        {
          label: 'Network In (MB/s)',
          data: trafficData.data.map(item => item.network_in),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4
        },
        {
          label: 'Network Out (MB/s)',
          data: trafficData.data.map(item => item.network_out),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'MB/s'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    maintainAspectRatio: false
  };

  if (trafficData.loading) {
    return (
      <div className={`dashboard-card flex items-center justify-center h-64 ${darkMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        <div className="text-gray-500">Loading network traffic data...</div>
      </div>
    );
  }

  if (trafficData.error) {
    return (
      <div className={`dashboard-card flex items-center justify-center h-64 ${darkMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        <div className="text-red-500">{trafficData.error}</div>
      </div>
    );
  }

  return (
    <div className={`dashboard-card ${darkMode === 'dark' ? ' text-gray-100' : ' text-gray-800'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TrendingUp className={`h-5 w-5 ${darkMode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mr-2`} />
          <h3 className="text-lg font-medium">Network Traffic</h3>
        </div>

        <select 
          className={`text-sm border ${darkMode === 'dark' ? 'border-gray-600 bg-gray-800 text-gray-200' : 'border-gray-300'} rounded-md px-2 py-1`}
          value={selectedHours}
          onChange={(e) => setSelectedHours(e.target.value)}
        >
          <option value="6">Last 6 hours</option>
          <option value="12">Last 12 hours</option>
          <option value="24">Last 24 hours</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="h-64">
        <Line data={formatData()} options={chartOptions} />
      </div>
    </div>
  );
}

export default NetworkTraffic;
