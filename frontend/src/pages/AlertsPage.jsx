// src/pages/AlertsPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import AlertSummary from '../components/AlertSummary';

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('/api/alerts');
        console.log('Fetched alerts:', response.data.data); // Debug log
        setAlerts(response.data.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      <AlertSummary />

      <div className="dashboard-card ">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-5 w-5 text-gray-700 mr-2" />
          <h3 className="text-lg font-medium">All Alerts</h3>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-gray-500">No alerts found.</div>
        ) : (
          <ul className="space-y-2 ">
            {alerts.map((alert) => (
              <li
                key={alert.id || Math.random()} // fallback key if id is missing
                className={`p-3 rounded-md text-sm text-gray-700 bg-white`}
              >
                <div
  className={`font-semibold inline-block px-2 py-1 rounded-md text-sm ${
    alert.severity === 'critical'
      ? 'bg-red-100 text-red-700'
      : alert.severity === 'medium'
      ? 'bg-yellow-100 text-yellow-700'
      : alert.severity === 'low'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-600'
  }`}
>
  {(alert.severity || 'unknown').toUpperCase()}
</div>

                <div>{alert.message || 'No message provided.'}</div>
                <div className="text-xs text-gray-500">
                  {alert.timestamp
                    ? new Date(alert.timestamp).toLocaleString()
                    : 'Unknown time'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AlertsPage;
