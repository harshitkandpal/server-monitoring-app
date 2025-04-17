import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ServerList from './pages/ServerList';
import ServerDetail from './pages/ServerDetail';
import AlertsPage from './pages/AlertsPage';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="servers" element={<ServerList />} />
        <Route path="servers/:id" element={<ServerDetail />} />
        <Route path="alerts" element={<AlertsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
