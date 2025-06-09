import React, { createContext, useContext, useState, useEffect } from 'react'

const PremiumContext = createContext()

export const usePremium = () => {
  const context = useContext(PremiumContext)
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider')
  }
  return context
}

export const PremiumProvider = ({ children }) => {
  const [subscriptionType, setSubscriptionType] = useState('free')
  const [dailyScans, setDailyScans] = useState(0)
  const [lastScanDate, setLastScanDate] = useState(null)

  useEffect(() => {
    const savedSubscription = localStorage.getItem('nutriscan_subscription')
    const savedScans = localStorage.getItem('nutriscan_daily_scans')
    const savedDate = localStorage.getItem('nutriscan_last_scan_date')

    if (savedSubscription) {
      setSubscriptionType(savedSubscription)
    }

    const today = new Date().toDateString()
    if (savedDate === today && savedScans) {
      setDailyScans(parseInt(savedScans))
    } else {
      setDailyScans(0)
      localStorage.setItem('nutriscan_daily_scans', '0')
      localStorage.setItem('nutriscan_last_scan_date', today)
    }

    setLastScanDate(savedDate)
  }, [])

  const canScan = () => {
    const limits = {
      free: 3,
      premium: 50,
      pro: Infinity
    }
    return dailyScans < limits[subscriptionType]
  }

  const incrementDailyScans = () => {
    const newCount = dailyScans + 1
    setDailyScans(newCount)
    localStorage.setItem('nutriscan_daily_scans', newCount.toString())
    localStorage.setItem('nutriscan_last_scan_date', new Date().toDateString())
  }

  const upgradeSubscription = (type) => {
    setSubscriptionType(type)
    localStorage.setItem('nutriscan_subscription', type)
  }

  const value = {
    subscriptionType,
    dailyScans,
    canScan,
    incrementDailyScans,
    upgradeSubscription
  }

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  )
}
