import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Officers from './pages/Officers';
import Violations from './pages/Violations';
import Vehicles from './pages/Vehicles';
import AllActivities from './pages/AllActivities';
import type { Admin } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [currentUser, setCurrentUser] = useState<Admin | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard admin={currentUser} onNavigate={setCurrentPage} />;
      case 'officers':
        return <Officers />;
      case 'violations':
        return <Violations />;
      case 'vehicles':
        return <Vehicles />;
      case 'all-activities':
        return <AllActivities />;
      default:
        return <Dashboard admin={currentUser} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Malawi Police Traffic Management
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              
              <button
                onClick={() => setCurrentPage('officers')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'officers'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Officers
              </button>
              
              <button
                onClick={() => setCurrentPage('violations')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'violations'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Violations
              </button>
              
              <button
                onClick={() => setCurrentPage('vehicles')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'vehicles'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Vehicles
              </button>
              
              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>{currentUser.fullName}</span>
                  <FontAwesomeIcon icon={faChevronDown} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                      </div>
                      <button
                        onClick={() => {
                          setCurrentUser(null);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;