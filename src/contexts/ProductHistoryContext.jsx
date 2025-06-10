import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePremium } from './PremiumContext'

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
    // Cargar historial desde localStorage al iniciar
    const savedHistory = localStorage.getItem('nutriscan_product_history')
    if (savedHistory) {
      try {
        setProductHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Error loading product history:', error)
      }
    }
  }, [])

  const addProductToHistory = (product, analysis) => {
    const historyItem = {
      id: Date.now(),
      scannedAt: new Date().toISOString(),
      product_name: product.name,
      brands: product.brand,
      barcode: product.barcode,
      image_url: product.image,
      nutriscore_grade: product.nutriscore,
      nutrition: product.nutrition,
      analysis: analysis
    }

    const updatedHistory = [historyItem, ...productHistory.slice(0, 99)] // Mantener máximo 100 productos
    setProductHistory(updatedHistory)
    
    // Guardar en localStorage
    localStorage.setItem('nutriscan_product_history', JSON.stringify(updatedHistory))
  }

  const getProductHistory = (subscriptionType = 'free') => {
    // Diferenciación por plan de suscripción
    switch (subscriptionType) {
      case 'free':
        return [] // Plan gratuito: sin historial
      case 'premium':
        return productHistory.slice(0, 5) // Plan premium: últimos 5 productos
      case 'pro':
        return productHistory // Plan pro: historial completo
      default:
        return []
    }
  }

  const clearHistory = () => {
    setProductHistory([])
    localStorage.removeItem('nutriscan_product_history')
  }

  const getProductById = (id) => {
    return productHistory.find(item => item.id === id)
  }

  const getHistoryCount = () => {
    return productHistory.length
  }

  return (
    <ProductHistoryContext.Provider value={{
      productHistory,
      addProductToHistory,
      getProductHistory,
      clearHistory,
      getProductById,
      getHistoryCount
    }}>
      {children}
    </ProductHistoryContext.Provider>
  )
}

