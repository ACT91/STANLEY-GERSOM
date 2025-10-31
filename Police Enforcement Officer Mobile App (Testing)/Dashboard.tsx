import { useState, useEffect } from 'react'
import { api } from './api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faMobileAlt, faClipboardList, faExclamationTriangle, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

interface Officer {
  officerID: number;
  serviceNumber: string;
  fullName: string;
  rank: string;
  station: string;
}

interface DashboardProps {
  officer: Officer;
  onLogout: () => void;
}

export default function Dashboard({ officer, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<'home' | 'scan-vehicle' | 'issue-violation'>('home')
  const [licensePlate, setLicensePlate] = useState('')
  const [vehicle, setVehicle] = useState<any>(null)
  const [violationTypes, setViolationTypes] = useState<any[]>([])
  const [selectedViolation, setSelectedViolation] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [vehicleInfo, setVehicleInfo] = useState({
    owner_name: '',
    owner_phone: '',
    vehicles_type: 'sedan'
  })

  useEffect(() => {
    loadViolationTypes()
  }, [])

  const loadViolationTypes = async () => {
    try {
      const result = await api.getViolationTypes()
      if (result.success) {
        setViolationTypes(result.data)
      }
    } catch (error) {
      console.error('Failed to load violation types:', error)
    }
  }

  const searchVehicle = async () => {
    if (!licensePlate.trim()) return
    
    setLoading(true)
    setMessage('')
    try {
      const result = await api.getVehicle(licensePlate)
      if (result.success) {
        setVehicle(result.vehicle)
        if (result.isNewVehicle) {
          setShowVehicleForm(true)
          setMessage('New vehicle detected. Please provide owner information.')
        }
      } else {
        setMessage('System error. Please try again.')
      }
    } catch (error) {
      setMessage('Connection error. Please check your internet.')
    } finally {
      setLoading(false)
    }
  }

  const updateVehicleInfo = async () => {
    if (!vehicleInfo.owner_name.trim() || !vehicleInfo.owner_phone.trim()) {
      setMessage('Please fill in owner name and phone number')
      return
    }

    setLoading(true)
    try {
      const result = await api.updateVehicle(vehicle.vehiclesID, vehicleInfo)
      if (result.success) {
        setVehicle({ ...vehicle, ...vehicleInfo })
        setShowVehicleForm(false)
        setMessage('Vehicle information updated successfully!')
      } else {
        setMessage('Failed to update vehicle information')
      }
    } catch (error) {
      setMessage('Error updating vehicle information')
    } finally {
      setLoading(false)
    }
  }

  const issueViolation = async () => {
    if (!vehicle || !selectedViolation || !location.trim()) {
      setMessage('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const violationType = violationTypes.find(v => v.typeID === parseInt(selectedViolation))
      const result = await api.issueViolation({
        vehicle_id: vehicle.vehiclesID,
        officer_id: officer.officerID,
        violation_type_id: parseInt(selectedViolation),
        location: location,
        notes: notes
      })

      if (result.success) {
        setMessage('Violation issued successfully!')
        // Reset form
        setLicensePlate('')
        setVehicle(null)
        setSelectedViolation('')
        setLocation('')
        setNotes('')
        
        // Trigger real-time update event
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'VIOLATION_CREATED' }, '*');
        }
        
        setTimeout(() => setCurrentView('home'), 2000)
      } else {
        setMessage(result.message || 'Failed to issue violation')
      }
    } catch (error) {
      setMessage('Error issuing violation')
    } finally {
      setLoading(false)
    }
  }

  if (currentView === 'scan-vehicle') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('home')}
              className="text-white hover:text-gray-200"
            >
              ← Back
            </button>
            <h1 className="text-lg font-semibold">Scan License Plate</h1>
            <div></div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Scan Interface */}
          <div className="bg-white rounded-lg p-6 shadow text-center">
            <div className="text-6xl mb-4 text-blue-600">
              <FontAwesomeIcon icon={faMobileAlt} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Enter License Plate</h2>
            <p className="text-gray-600 mb-6">Manually enter the vehicle's license plate number</p>
            
            <div className="space-y-4">
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg font-mono"
                placeholder="e.g., BL 1234 A"
              />
              <button
                onClick={searchVehicle}
                disabled={loading || !licensePlate.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Check Vehicle'}
              </button>
            </div>
          </div>

          {/* Vehicle Info Form */}
          {showVehicleForm && vehicle && (
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="font-semibold mb-4">New Vehicle: {vehicle.license_plate}</h3>
              <p className="text-gray-600 mb-4">Please provide owner information for this new vehicle:</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    value={vehicleInfo.owner_name}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, owner_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter owner's full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={vehicleInfo.owner_phone}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, owner_phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 0999123456"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select
                    value={vehicleInfo.vehicles_type}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, vehicles_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    title="Select vehicle type"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bus">Bus</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={updateVehicleInfo}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Save Information'}
                  </button>
                  <button
                    onClick={() => setShowVehicleForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Info */}
          {vehicle && !showVehicleForm && (
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Vehicle: {vehicle.license_plate}</h3>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  vehicle.hasViolationsToday 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {vehicle.hasViolationsToday ? 'Has Violations Today' : 'Clean Record Today'}
                </div>
              </div>
              
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p><strong>Owner:</strong> {vehicle.owner_name}</p>
                <p><strong>Type:</strong> {vehicle.vehicles_type}</p>
                <p><strong>Phone:</strong> {vehicle.owner_phone}</p>
              </div>
              
              {!vehicle.hasViolationsToday ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2 text-green-600">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <p className="text-lg font-medium text-green-700 mb-2">No violation record found</p>
                  <p className="text-gray-600 text-sm mb-4">This vehicle has no violations today</p>
                  <button
                    onClick={() => setCurrentView('issue-violation')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Record New Violation
                  </button>
                </div>
              ) : (
                <div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="font-semibold text-red-800">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                      Today's Violations: {vehicle.todayViolations.length}
                    </p>
                    {vehicle.todayViolations.map((v: any, i: number) => (
                      <p key={i} className="text-red-700 text-sm">
                        • {v.violation_name} - MWK {v.fine_amount.toLocaleString()} ({v.officer_name})
                      </p>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentView('issue-violation')}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700"
                  >
                    Issue Another Violation
                  </button>
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    )
  }

  if (currentView === 'issue-violation') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('home')}
              className="text-white hover:text-gray-200"
            >
              ← Back
            </button>
            <h1 className="text-lg font-semibold">Issue Violation</h1>
            <div></div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* License Plate Search */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="font-semibold mb-3">Vehicle Information</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter license plate (e.g., BL 1234 A)"
              />
              <button
                onClick={searchVehicle}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '...' : 'Search'}
              </button>
            </div>

            {vehicle && vehicle.owner_name !== 'To be updated' && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <p><strong>Owner:</strong> {vehicle.owner_name}</p>
                <p><strong>Type:</strong> {vehicle.vehicles_type}</p>
                <p><strong>Phone:</strong> {vehicle.owner_phone}</p>
              </div>
            )}
            
            {vehicle && vehicle.owner_name === 'To be updated' && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-yellow-800 font-medium mb-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  Vehicle owner information needed
                </p>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={vehicleInfo.owner_name}
                      onChange={(e) => setVehicleInfo({...vehicleInfo, owner_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Owner's full name"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={vehicleInfo.owner_phone}
                      onChange={(e) => setVehicleInfo({...vehicleInfo, owner_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Phone number (e.g., 0999123456)"
                    />
                  </div>
                  <div>
                    <select
                      value={vehicleInfo.vehicles_type}
                      onChange={(e) => setVehicleInfo({...vehicleInfo, vehicles_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      title="Select vehicle type"
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="truck">Truck</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="bus">Bus</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <button
                    onClick={updateVehicleInfo}
                    disabled={loading || !vehicleInfo.owner_name.trim() || !vehicleInfo.owner_phone.trim()}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Vehicle Info'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Violation Details */}
          {vehicle && (
            <div className="bg-white rounded-lg p-4 shadow space-y-4">
              <h2 className="font-semibold">Violation Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Violation Type *
                </label>
                <select
                  value={selectedViolation}
                  onChange={(e) => setSelectedViolation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  title="Select violation type"
                  required
                >
                  <option value="">Select violation type</option>
                  {violationTypes.map((type) => {
                    const baseFine = type.base_fine;
                    const hasViolationsToday = vehicle.todayViolations && vehicle.todayViolations.length > 0;
                    const surcharge = hasViolationsToday ? baseFine * 0.25 : 0;
                    const totalFine = baseFine + surcharge;
                    
                    return (
                      <option key={type.typeID} value={type.typeID}>
                        {type.violation_name} - MWK {totalFine.toLocaleString()}
                        {hasViolationsToday && ' (Repeat Offender +25%)'}
                      </option>
                    );
                  })}
                </select>
                
                {selectedViolation && vehicle.todayViolations && vehicle.todayViolations.length > 0 && (
                  <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                    <p className="text-orange-800 font-medium">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                      Repeat Offender Detected
                    </p>
                    <p className="text-orange-700">25% surcharge will be added to base fine</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Blantyre-Lilongwe Road"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Additional details about the violation"
                />
              </div>

              <button
                onClick={issueViolation}
                disabled={loading || !selectedViolation || !location.trim()}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Issuing Violation...' : 'Issue Violation'}
              </button>
            </div>
          )}

          {message && (
            <div className={`p-3 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Police Mobile App</h1>
            <p className="text-blue-100 text-sm">{officer.fullName}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-800"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Officer Info */}
      <div className="bg-white p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">
              <FontAwesomeIcon icon={faClipboardList} />
            </span>
          </div>
          <div>
            <p className="font-semibold">{officer.fullName}</p>
            <p className="text-gray-600 text-sm">{officer.rank} • {officer.serviceNumber}</p>
            <p className="text-gray-600 text-sm">{officer.station}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentView('scan-vehicle')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl mb-2 text-blue-600">
                <FontAwesomeIcon icon={faMobileAlt} />
              </div>
              <p className="font-medium">Scan Vehicle</p>
              <p className="text-gray-600 text-sm">Check license plate</p>
            </div>
          </button>

          <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow opacity-50">
            <div className="text-center">
              <div className="text-3xl mb-2 text-gray-600">
                <FontAwesomeIcon icon={faClipboardList} />
              </div>
              <p className="font-medium">My Reports</p>
              <p className="text-gray-600 text-sm">View issued tickets</p>
            </div>
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="p-4">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-green-700 font-medium">On Duty</span>
          </div>
        </div>
      </div>
    </div>
  )
}