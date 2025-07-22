import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [localProfile, setLocalProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('nutriscan_user')
    const savedLocalProfile = localStorage.getItem('nutriscan_local_profile')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedLocalProfile) {
      setLocalProfile(JSON.parse(savedLocalProfile))
    }
    
    // Cargar Google Identity Services
    loadGoogleScript()
    
    setLoading(false)
  }, [])

  const loadGoogleScript = () => {
    if (document.getElementById('google-identity-script')) return

    const script = document.createElement('script')
    script.id = 'google-identity-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }

  const signIn = async (email, password) => {
    try {
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('nutriscan_user', JSON.stringify(userData))
      
      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signUp = async (email, password) => {
    try {
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('nutriscan_user', JSON.stringify(userData))
      
      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signInWithGoogle = async () => {
    return new Promise((resolve, reject) => {
      try {
        // Verificar si Google Identity Services está disponible
        if (typeof window.google === 'undefined') {
          // Fallback: usar window.open con OAuth URL real
          const clientId = '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com' // Placeholder
          const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback')
          const scope = encodeURIComponent('openid email profile')
          const responseType = 'code'
          const state = Math.random().toString(36).substring(2, 15)
          
          const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&state=${state}`
          
          const popup = window.open(
            googleAuthUrl,
            'google-auth',
            'width=500,height=600,scrollbars=yes,resizable=yes'
          )

          // Monitorear el popup
          const checkClosed = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkClosed)
              // Simular datos de usuario para demo
              const userData = {
                id: 'google_' + Date.now(),
                email: 'usuario@gmail.com',
                name: 'Usuario Google',
                provider: 'google',
                avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
                createdAt: new Date().toISOString()
              }
              
              setUser(userData)
              localStorage.setItem('nutriscan_user', JSON.stringify(userData))
              resolve({ user: userData, error: null })
            }
          }, 1000)

          return
        }

        // Usar Google Identity Services si está disponible
        window.google.accounts.id.initialize({
          client_id: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', // Placeholder
          callback: (response) => {
            try {
              // Decodificar el JWT token
              const payload = JSON.parse(atob(response.credential.split('.')[1]))
              
              const userData = {
                id: 'google_' + payload.sub,
                email: payload.email,
                name: payload.name,
                provider: 'google',
                avatar: payload.picture,
                createdAt: new Date().toISOString()
              }
              
              setUser(userData)
              localStorage.setItem('nutriscan_user', JSON.stringify(userData))
              resolve({ user: userData, error: null })
            } catch (error) {
              reject({ user: null, error })
            }
          }
        })

        window.google.accounts.id.prompt()
        
      } catch (error) {
        reject({ user: null, error })
      }
    })
  }

  const signOut = async () => {
    try {
      setUser(null)
      setLocalProfile(null)
      localStorage.removeItem('nutriscan_user')
      localStorage.removeItem('nutriscan_local_profile')
      localStorage.removeItem('nutriscan_health_profile')
      
      // Cerrar sesión de Google si está disponible
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect()
      }
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const continueWithoutAccount = () => {
    const localUserData = {
      id: 'local_' + Date.now(),
      email: null,
      name: 'Usuario Local',
      isLocal: true,
      createdAt: new Date().toISOString()
    }
    
    setLocalProfile(localUserData)
    localStorage.setItem('nutriscan_local_profile', JSON.stringify(localUserData))
    
    return { user: localUserData, error: null }
  }

  const isAuthenticated = () => {
    return !!(user || localProfile)
  }

  const getCurrentUser = () => {
    return user || localProfile
  }

  const value = {
    user,
    localProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    continueWithoutAccount,
    isAuthenticated,
    getCurrentUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
