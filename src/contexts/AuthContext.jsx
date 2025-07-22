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
    script.onload = () => {
      initializeGoogleAuth()
    }
    document.head.appendChild(script)
  }

  const initializeGoogleAuth = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: '764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com',
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      })
    }
  }

  const handleGoogleResponse = (response) => {
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
    } catch (error) {
      console.error('Error processing Google response:', error)
    }
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
        if (window.google && window.google.accounts) {
          // Usar Google One Tap
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // Si One Tap no se muestra, usar el botón de Google
              renderGoogleButton(resolve, reject)
            }
          })
        } else {
          // Fallback si Google no está disponible
          setTimeout(() => {
            if (window.google && window.google.accounts) {
              renderGoogleButton(resolve, reject)
            } else {
              reject(new Error('Google Services no disponible'))
            }
          }, 1000)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  const renderGoogleButton = (resolve, reject) => {
    // Crear un div temporal para el botón de Google
    const buttonDiv = document.createElement('div')
    buttonDiv.id = 'google-signin-button'
    buttonDiv.style.position = 'fixed'
    buttonDiv.style.top = '50%'
    buttonDiv.style.left = '50%'
    buttonDiv.style.transform = 'translate(-50%, -50%)'
    buttonDiv.style.zIndex = '10000'
    buttonDiv.style.backgroundColor = 'white'
    buttonDiv.style.padding = '20px'
    buttonDiv.style.borderRadius = '8px'
    buttonDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
    
    document.body.appendChild(buttonDiv)

    // Crear overlay
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100%'
    overlay.style.height = '100%'
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)'
    overlay.style.zIndex = '9999'
    overlay.onclick = () => {
      document.body.removeChild(buttonDiv)
      document.body.removeChild(overlay)
      reject(new Error('Cancelado por el usuario'))
    }
    
    document.body.appendChild(overlay)

    // Renderizar botón de Google
    window.google.accounts.id.renderButton(buttonDiv, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left'
    })

    // Configurar callback temporal
    const originalCallback = window.google.accounts.id.callback
    window.google.accounts.id.callback = (response) => {
      try {
        // Limpiar elementos
        document.body.removeChild(buttonDiv)
        document.body.removeChild(overlay)
        
        // Procesar respuesta
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
        
        // Restaurar callback original
        window.google.accounts.id.callback = originalCallback
        
        resolve({ user: userData, error: null })
      } catch (error) {
        reject(error)
      }
    }
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
