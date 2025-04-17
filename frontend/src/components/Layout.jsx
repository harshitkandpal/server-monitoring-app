// src/components/Layout.jsx
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Server, Bell, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Servers', href: '/servers', icon: Server },
    { name: 'Alerts', href: '/alerts', icon: Bell },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Overlay for mobile sidebar */}
      <div
        className={`fixed inset-0 z-30 transition-opacity bg-black bg-opacity-50 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Server className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">Server Monitor</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2 rounded-md transition-all ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden bg-white">
        {/* Header */}
        <header className="shadow-sm border-b bg-gray-100 px-4 py-3 flex items-center justify-between md:px-6">
          <button
            className="md:hidden text-gray-700"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-base md:text-lg font-semibold text-gray-800">
            {navigation.find((item) => item.href === location.pathname)?.name ||
              'Server Monitoring'}
          </h1>
          <div className="text-sm text-gray-500">Admin</div>
        </header>

        {/* Page content area (scrollable if needed) */}
        <main className="flex-1 overflow-y-auto bg-gray-200 px-4 py-6 md:px-8 text-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
