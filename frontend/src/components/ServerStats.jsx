// src/components/ServerStats.jsx
import { useState, useEffect } from 'react';
import { Server, Activity } from 'lucide-react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function ServerStats() {
  const [statsData, setStatsData] = useState({
    cpu_usage: 0,
    ram_usage: 0,
    disk_usage: 0,
    application_performance: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/metrics/summary');
        console.log(response)
        setStatsData({
          ...response.data.data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching server stats:', error);
        setStatsData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load server statistics'
        }));
      }
    };

    fetchStats();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getChartData = (value, label, color) => {
    return {
      labels: [label, 'Available'],
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: [color, '#e5e7eb'],
          borderWidth: 0,
          cutout: '70%'
        },
      ],
    };
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    maintainAspectRatio: false
  };

  if (statsData.loading) {
    return (
      <div className="dashboard-card flex items-center justify-center h-64">
        <div className="text-gray-500">Loading server statistics...</div>
      </div>
    );
  }

  if (statsData.error) {
    return (
      <div className="dashboard-card flex items-center justify-center h-64">
        <div className="text-red-500">{statsData.error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="flex items-center mb-4">
        <Activity className="h-5 w-5 text-gray-700 mr-2" />
        <h3 className="text-lg font-medium">Server Usage</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* CPU Usage */}
        <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
          <div className="h-24 w-24 relative mb-2">
            <Doughnut 
              data={getChartData(statsData.cpu_usage, 'CPU', '#3b82f6')} 
              options={chartOptions}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold">{Math.round(statsData.cpu_usage)}%</span>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700">CPU</span>
        </div>
        
        {/* RAM Usage */}
        <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center">
          <div className="h-24 w-24 relative mb-2">
            <Doughnut 
              data={getChartData(statsData.ram_usage, 'RAM', '#8b5cf6')} 
              options={chartOptions}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold">{Math.round(statsData.ram_usage)}%</span>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700">RAM</span>
        </div>
        
        {/* Disk Usage */}
        <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center">
          <div className="h-24 w-24 relative mb-2">
            <Doughnut 
              data={getChartData(statsData.disk_usage, 'Disk', '#10b981')} 
              options={chartOptions}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold">{Math.round(statsData.disk_usage)}%</span>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700">Disk</span>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Application Performance</h4>
        <div className="h-4 bg-gray-200 rounded-full">
          <div 
            className="h-4 bg-blue-600 rounded-full" 
            style={{ 
              width: `${Math.min(100, (statsData.application_performance / 5))}%`,
              backgroundColor: statsData.application_performance < 100 ? '#10b981' : 
                              statsData.application_performance < 200 ? '#f59e0b' : '#f43f5e'
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Good</span>
          <span>Response time: {Math.round(statsData.application_performance)} ms</span>
          <span>Poor</span>
        </div>
      </div>
    </div>
  );
}

export default ServerStats;