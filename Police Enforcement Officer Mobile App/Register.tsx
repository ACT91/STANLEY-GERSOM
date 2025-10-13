import { useState } from 'react'
import { api } from './api'

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    serviceNumber: '',
    fullName: '',
    rank: '',
    station: '',
    pin: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await api.registerOfficer(formData)
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.message || 'Registration failed')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-green-50">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
          <p className="text-gray-600 mb-8">
            Your account has been created. Please wait for admin approval before you can login.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-blue-50">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-bold">📝</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Officer Registration</h1>
        <p className="text-gray-600 mt-2">Create your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Number
          </label>
          <input
            type="text"
            value={formData.serviceNumber}
            onChange={(e) => setFormData({...formData, serviceNumber: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., MP001"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rank
          </label>
          <select
            value={formData.rank}
            onChange={(e) => setFormData({...formData, rank: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Rank</option>
            <option value="Constable">Constable</option>
            <option value="Corporal">Corporal</option>
            <option value="Sergeant">Sergeant</option>
            <option value="Inspector">Inspector</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Station
          </label>
          <input
            type="text"
            value={formData.station}
            onChange={(e) => setFormData({...formData, station: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Blantyre Central"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PIN (4-6 digits)
          </label>
          <input
            type="password"
            value={formData.pin}
            onChange={(e) => setFormData({...formData, pin: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Create a PIN"
            maxLength={6}
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 font-medium hover:text-blue-500"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  )
}