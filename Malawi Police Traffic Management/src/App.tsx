import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Officers from './pages/Officers';
import Violations from './pages/Violations';
import type { Admin } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<Admin | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard admin={currentUser} />;
      case 'officers':
        return <Officers />;
      case 'violations':
        return <Violations />;
      default:
        return <Dashboard admin={currentUser} />;
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
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              
              <button
                onClick={() => setCurrentPage('officers')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'officers'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Officers
              </button>
              
              <button
                onClick={() => setCurrentPage('violations')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'violations'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Violations
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{currentUser.fullName}</span>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Logout
                </button>
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