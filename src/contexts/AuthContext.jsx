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
    
    setLoading(false)
  }, [])

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
    try {
      // Simulación de Google Auth - En producción real necesitarías Google OAuth
      const googleUserData = {
        id: 'google_' + Date.now(),
        email: 'usuario@gmail.com',
        name: 'Usuario Google',
        provider: 'google',
        avatar: 'https://via.placeholder.com/100',
        createdAt: new Date( ).toISOString()
      }
      
      setUser(googleUserData)
      localStorage.setItem('nutriscan_user', JSON.stringify(googleUserData))
      
      return { user: googleUserData, error: null }
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
