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
    // Cargar datos del localStorage al iniciar
    const savedUser = localStorage.getItem('nutriscan_user')
    const savedLocalProfile = localStorage.getItem('nutriscan_local_profile')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedLocalProfile) {
      setLocalProfile(JSON.parse(savedLocalProfile))
    }
    
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    try {
      // Simulación de autenticación
      const userData = {
        id: Date.now().toString(),
        email,
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
    try {
      // Implementación real de Google Auth usando Google Identity Services
      return new Promise((resolve, reject) => {
        if (typeof window.google === 'undefined') {
          // Fallback si Google no está disponible
          const fallbackUser = {
            id: 'google_' + Date.now(),
            email: 'usuario@gmail.com',
            name: 'Usuario Google',
            picture: 'https://via.placeholder.com/150',
            provider: 'google',
            createdAt: new Date().toISOString()
          }
          
          setUser(fallbackUser)
          localStorage.setItem('nutriscan_user', JSON.stringify(fallbackUser))
          resolve({ user: fallbackUser, error: null })
          return
        }

        // Configurar Google Identity Services
        window.google.accounts.id.initialize({
          client_id: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', // Placeholder
          callback: (response) => {
            try {
              // Decodificar JWT token
              const payload = JSON.parse(atob(response.credential.split('.')[1]))
              
              const googleUserData = {
                id: 'google_' + payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                provider: 'google',
                createdAt: new Date().toISOString()
              }
              
              setUser(googleUserData)
              localStorage.setItem('nutriscan_user', JSON.stringify(googleUserData))
              
              // Sincronizar datos locales con cuenta Google
              const localHealthProfile = localStorage.getItem('nutriscan_health_profile')
              const localProductHistory = localStorage.getItem('nutriscan_product_history')
              
              if (localHealthProfile) {
                localStorage.setItem(`nutriscan_health_profile_${googleUserData.id}`, localHealthProfile)
              }
              
              if (localProductHistory) {
                localStorage.setItem(`nutriscan_product_history_${googleUserData.id}`, localProductHistory)
              }
              
              resolve({ user: googleUserData, error: null })
            } catch (error) {
              reject({ user: null, error })
            }
          }
        })

        // Mostrar prompt de Google
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Si no se puede mostrar el prompt, usar fallback
            const fallbackUser = {
              id: 'google_' + Date.now(),
              email: 'usuario@gmail.com',
              name: 'Usuario Google',
              picture: 'https://via.placeholder.com/150',
              provider: 'google',
              createdAt: new Date().toISOString()
            }
            
            setUser(fallbackUser)
            localStorage.setItem('nutriscan_user', JSON.stringify(fallbackUser))
            resolve({ user: fallbackUser, error: null })
          }
        })
      })
    } catch (error) {
      return { user: null, error }
    }
  }

  const signUp = async (email, password) => {
    try {
      // Simulación de registro
      const userData = {
        id: Date.now().toString(),
        email,
        createdAt: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('nutriscan_user', JSON.stringify(userData))
      
      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signOut = async () => {
    try {
      setUser(null)
      setLocalProfile(null)
      localStorage.removeItem('nutriscan_user')
      localStorage.removeItem('nutriscan_local_profile')
      localStorage.removeItem('nutriscan_health_profile')
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const continueWithoutAccount = () => {
    const localUserData = {
      id: 'local_' + Date.now(),
      email: null,
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

