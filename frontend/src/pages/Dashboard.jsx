// src/pages/Dashboard.jsx
import AlertSummary from '../components/AlertSummary';
import ServerStats from '../components/ServerStats';
import NetworkTraffic from '../components/NetworkTraffic';
import ServerTable from '../components/ServerTable';

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AlertSummary />
        <div className="md:col-span-2">
          <ServerStats />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NetworkTraffic />
        <ServerTable />
      </div>
    </div>
  );
}

export default Dashboard;