import React, { createContext, useContext, useState, useEffect } from 'react'

const HealthProfileContext = createContext()

export const useHealthProfile = () => {
  const context = useContext(HealthProfileContext)
  if (!context) {
    throw new Error('useHealthProfile must be used within a HealthProfileProvider')
  }
  return context
}

export const HealthProfileProvider = ({ children }) => {
  const [healthProfile, setHealthProfile] = useState(null)

  useEffect(() => {
    const savedProfile = localStorage.getItem('nutriscan_health_profile')
    if (savedProfile) {
      setHealthProfile(JSON.parse(savedProfile))
    }
  }, [])

  const updateHealthProfile = (profile) => {
    setHealthProfile(profile)
    localStorage.setItem('nutriscan_health_profile', JSON.stringify(profile))
  }

  const value = {
    healthProfile,
    updateHealthProfile
  }

  return (
    <HealthProfileContext.Provider value={value}>
      {children}
    </HealthProfileContext.Provider>
  )
}
