import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'

interface Officer {
  officerID: number;
  serviceNumber: string;
  fullName: string;
  rank: string;
  station: string;
  isActive: boolean;
}

function App() {
  const [currentOfficer, setCurrentOfficer] = useState<Officer | null>(null)
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login')

  const handleLogin = (officer: Officer) => {
    setCurrentOfficer(officer)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setCurrentOfficer(null)
    setCurrentView('login')
  }

  return (
    <div className="mobile-container">
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setCurrentView('register')}
        />
      )}
      
      {currentView === 'register' && (
        <Register 
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}
      
      {currentView === 'dashboard' && currentOfficer && (
        <Dashboard 
          officer={currentOfficer}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App