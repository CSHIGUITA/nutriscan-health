import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const HealthProfileContext = createContext()

export const useHealthProfile = () => {
  const context = useContext(HealthProfileContext)
  if (!context) {
    throw new Error('useHealthProfile must be used within a HealthProfileProvider')
  }
  return context
}

export const HealthProfileProvider = ({ children }) => {
  const { getCurrentUser } = useAuth()
  const [healthProfile, setHealthProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHealthProfile()
  }, [])

  const loadHealthProfile = () => {
    try {
      const savedProfile = localStorage.getItem('nutriscan_health_profile')
      if (savedProfile) {
        setHealthProfile(JSON.parse(savedProfile))
      }
    } catch (error) {
      console.error('Error loading health profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateHealthProfile = async (profileData) => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error('No user authenticated')
      }

      const updatedProfile = {
        ...healthProfile,
        ...profileData,
        userId: currentUser.id,
        updatedAt: new Date().toISOString()
      }

      setHealthProfile(updatedProfile)
      localStorage.setItem('nutriscan_health_profile', JSON.stringify(updatedProfile))

      return { error: null }
    } catch (error) {
      console.error('Error updating health profile:', error)
      return { error }
    }
  }

  const getHealthConditions = () => {
    return healthProfile?.conditions || []
  }

  const getHealthGoals = () => {
    return healthProfile?.goals || []
  }

  const hasHealthProfile = () => {
    return !!(healthProfile?.conditions?.length || healthProfile?.goals?.length)
  }

  const value = {
    healthProfile,
    loading,
    updateHealthProfile,
    getHealthConditions,
    getHealthGoals,
    hasHealthProfile,
    loadHealthProfile
  }

  return (
    <HealthProfileContext.Provider value={value}>
      {children}
    </HealthProfileContext.Provider>
  )
}

