import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { HealthProfileProvider } from './contexts/HealthProfileContext'
import { PremiumProvider } from './contexts/PremiumContext'
import { ProductHistoryProvider } from './contexts/ProductHistoryContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Scanner from './pages/Scanner'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Welcome from './pages/Welcome'
import Auth from './pages/Auth'
import Subscription from './pages/Subscription'
import Support from './pages/Support'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ProductHistory from './pages/ProductHistory'
import './App.css'
import './styles/dark-mode.css'

function App() {
  return (
    <AuthProvider>
      <HealthProfileProvider>
        <PremiumProvider>
          <ProductHistoryProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/home" element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  <Route path="/scanner" element={
                    <ProtectedRoute>
                      <Scanner />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/subscription" element={
                    <ProtectedRoute>
                      <Subscription />
                    </ProtectedRoute>
                  } />
                  <Route path="/support" element={
                    <ProtectedRoute>
                      <Support />
                    </ProtectedRoute>
                  } />
                  <Route path="/privacy" element={
                    <ProtectedRoute>
                      <PrivacyPolicy />
                    </ProtectedRoute>
                  } />
                  <Route path="/history" element={
                    <ProtectedRoute>
                      <ProductHistory />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </Router>
          </ProductHistoryProvider>
        </PremiumProvider>
      </HealthProfileProvider>
    </AuthProvider>
  )
}

export default App
