import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          Malawi Police Traffic Management System
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Violations</CardTitle>
              <CardDescription>
                Manage and track traffic violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record and process traffic violations efficiently
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Registration</CardTitle>
              <CardDescription>
                Vehicle registration and licensing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage vehicle registrations and renewals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Driver Licenses</CardTitle>
              <CardDescription>
                Driver license management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Issue and manage driver licenses
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App