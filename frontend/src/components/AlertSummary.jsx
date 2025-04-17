// src/components/AlertSummary.jsx
import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';

function AlertSummary() {
  const [alertData, setAlertData] = useState({
    critical: 0,
    medium: 0,
    low: 0,
    total: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchAlertSummary = async () => {
      try {
        const response = await axios.get('/api/alerts/summary');
        setAlertData({
          ...response.data.data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching alert summary:', error);
        setAlertData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load alert data'
        }));
      }
    };

    fetchAlertSummary();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAlertSummary, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (alertData.loading) {
    return (
      <div className="dashboard-card flex items-center justify-center h-32">
        <div className="text-gray-500">Loading alert data...</div>
      </div>
    );
  }

  if (alertData.error) {
    return (
      <div className="dashboard-card flex items-center justify-center h-32">
        <div className="text-red-500">{alertData.error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="flex items-center mb-4">
        <AlertCircle className="h-5 w-5 text-gray-700 mr-2" />
        <h3 className="text-lg font-medium">Active Alerts</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Critical</span>
            <span className="px-2 py-1 rounded bg-critical text-xs font-bold">
              {alertData.critical}
            </span>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Medium</span>
            <span className="px-2 py-1 rounded bg-medium text-xs font-bold">
              {alertData.medium}
            </span>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Low</span>
            <span className="px-2 py-1 rounded bg-low text-xs font-bold">
              {alertData.low}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        {alertData.total > 0 ? (
          <span>Total {alertData.total} active alerts</span>
        ) : (
          <span>No active alerts</span>
        )}
      </div>
    </div>
  );
}  
export default AlertSummary;