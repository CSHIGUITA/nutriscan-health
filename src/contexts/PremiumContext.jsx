import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const PremiumContext = createContext()

export const usePremium = () => {
  const context = useContext(PremiumContext)
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider')
  }
  return context
}

export const PremiumProvider = ({ children }) => {
  const { getCurrentUser } = useAuth()
  const [subscriptionType, setSubscriptionType] = useState('free') // 'free', 'premium', 'pro'
  const [dailyScans, setDailyScans] = useState(0)
  const [subscriptionData, setSubscriptionData] = useState(null)

  useEffect(() => {
    loadSubscriptionData()
    resetDailyScansIfNeeded()
  }, [])

  const loadSubscriptionData = () => {
    try {
      const savedSubscription = localStorage.getItem('nutriscan_subscription')
      if (savedSubscription) {
        const data = JSON.parse(savedSubscription)
        setSubscriptionType(data.type || 'free')
        setSubscriptionData(data)
      }

      const savedScans = localStorage.getItem('nutriscan_daily_scans')
      if (savedScans) {
        const scansData = JSON.parse(savedScans)
        const today = new Date().toDateString()
        
        if (scansData.date === today) {
          setDailyScans(scansData.count)
        } else {
          setDailyScans(0)
          localStorage.setItem('nutriscan_daily_scans', JSON.stringify({
            date: today,
            count: 0
          }))
        }
      }
    } catch (error) {
      console.error('Error loading subscription data:', error)
    }
  }

  const resetDailyScansIfNeeded = () => {
    const today = new Date().toDateString()
    const savedScans = localStorage.getItem('nutriscan_daily_scans')
    
    if (savedScans) {
      const scansData = JSON.parse(savedScans)
      if (scansData.date !== today) {
        setDailyScans(0)
        localStorage.setItem('nutriscan_daily_scans', JSON.stringify({
          date: today,
          count: 0
        }))
      }
    }
  }

  const incrementDailyScans = () => {
    const newCount = dailyScans + 1
    setDailyScans(newCount)
    
    const today = new Date().toDateString()
    localStorage.setItem('nutriscan_daily_scans', JSON.stringify({
      date: today,
      count: newCount
    }))
  }

  const canScan = () => {
    if (subscriptionType === 'premium' || subscriptionType === 'pro') {
      return true
    }
    return dailyScans < 5 // Límite gratuito de 5 escaneos diarios
  }

  const getRemainingScans = () => {
    if (subscriptionType === 'premium' || subscriptionType === 'pro') {
      return 'Ilimitado'
    }
    return Math.max(0, 5 - dailyScans)
  }

  const upgradeSubscription = async (planType, billingCycle = 'monthly') => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error('No user authenticated')
      }

      // Simulación de proceso de pago
      const subscriptionInfo = {
        type: planType,
        billingCycle,
        userId: currentUser.id,
        startDate: new Date().toISOString(),
        status: 'active'
      }

      setSubscriptionType(planType)
      setSubscriptionData(subscriptionInfo)
      localStorage.setItem('nutriscan_subscription', JSON.stringify(subscriptionInfo))

      return { success: true, error: null }
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      return { success: false, error }
    }
  }

  const cancelSubscription = async () => {
    try {
      setSubscriptionType('free')
      setSubscriptionData(null)
      localStorage.removeItem('nutriscan_subscription')

      return { success: true, error: null }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return { success: false, error }
    }
  }

  const getSubscriptionFeatures = () => {
    const features = {
      free: {
        scans: '5 diarios',
        analysis: 'Básico',
        history: '7 días',
        ads: 'Sí',
        support: 'Comunidad'
      },
      premium: {
        scans: 'Ilimitados',
        analysis: 'Avanzado',
        history: 'Completo',
        ads: 'No',
        support: 'Email'
      },
      pro: {
        scans: 'Ilimitados',
        analysis: 'IA Avanzada',
        history: 'Completo + Exportar',
        ads: 'No',
        support: 'Prioritario'
      }
    }

    return features[subscriptionType] || features.free
  }

  const value = {
    subscriptionType,
    dailyScans,
    subscriptionData,
    canScan,
    getRemainingScans,
    incrementDailyScans,
    upgradeSubscription,
    cancelSubscription,
    getSubscriptionFeatures,
    loadSubscriptionData
  }

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  )
}

