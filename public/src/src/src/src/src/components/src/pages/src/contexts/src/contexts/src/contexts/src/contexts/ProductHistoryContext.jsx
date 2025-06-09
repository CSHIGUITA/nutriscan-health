import React, { createContext, useContext, useState, useEffect } from 'react'

const ProductHistoryContext = createContext()

export const useProductHistory = () => {
  const context = useContext(ProductHistoryContext)
  if (!context) {
    throw new Error('useProductHistory must be used within a ProductHistoryProvider')
  }
  return context
}

export const ProductHistoryProvider = ({ children }) => {
  const [productHistory, setProductHistory] = useState([])

  useEffect(() => {
    const savedHistory = localStorage.getItem('nutriscan_product_history')
    if (savedHistory) {
      setProductHistory(JSON.parse(savedHistory))
    }
  }, [])

  const addProductToHistory = (product, analysis) => {
    const historyItem = {
      id: Date.now().toString(),
      product,
      analysis,
      scannedAt: new Date().toISOString()
    }

    const updatedHistory = [historyItem, ...productHistory].slice(0, 50)
    setProductHistory(updatedHistory)
    localStorage.setItem('nutriscan_product_history', JSON.stringify(updatedHistory))
  }

  const clearHistory = () => {
    setProductHistory([])
    localStorage.removeItem('nutriscan_product_history')
  }

  const value = {
    productHistory,
    addProductToHistory,
    clearHistory
  }

  return (
    <ProductHistoryContext.Provider value={value}>
      {children}
    </ProductHistoryContext.Provider>
  )
}
