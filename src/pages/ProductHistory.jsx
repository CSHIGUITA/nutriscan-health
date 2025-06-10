import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePremium } from '../contexts/PremiumContext'
import { useProductHistory } from '../contexts/ProductHistoryContext'
import { ArrowLeft, History, Clock, Package, Crown } from 'lucide-react'

const ProductHistory = () => {
  const navigate = useNavigate()
  const { subscriptionType } = usePremium()
  const { getProductHistory } = useProductHistory()

  const historyProducts = getProductHistory(subscriptionType)

  const handleProductClick = (product) => {
    navigate('/scanner', { 
      state: { 
        productInfo: product,
        analysis: product.analysis,
        fromHistory: true 
      } 
    })
  }

  const getSubscriptionInfo = () => {
    switch (subscriptionType) {
      case 'free':
        return {
          title: 'Plan Gratuito',
          description: 'El historial está disponible en planes Premium y Pro',
          color: 'bg-gray-100 text-gray-800',
          limit: 0
        }
      case 'premium':
        return {
          title: 'Plan Premium',
          description: 'Historial de los últimos 5 productos escaneados',
          color: 'bg-blue-100 text-blue-800',
          limit: 5
        }
      case 'pro':
        return {
          title: 'Plan Pro',
          description: 'Historial completo de todos los productos escaneados',
          color: 'bg-purple-100 text-purple-800',
          limit: 'ilimitado'
        }
      default:
        return {
          title: 'Plan Gratuito',
          description: 'El historial está disponible en planes Premium y Pro',
          color: 'bg-gray-100 text-gray-800',
          limit: 0
        }
    }
  }

  const subscriptionInfo = getSubscriptionInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <button
            onClick={() => navigate('/home')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Historial de Productos</h1>
            <p className="text-sm text-gray-600">Productos escaneados anteriormente</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${subscriptionInfo.color}`}>
            {subscriptionInfo.title}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Información del plan */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <History className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{subscriptionInfo.title}</h2>
                <p className="text-blue-100">{subscriptionInfo.description}</p>
              </div>
            </div>
            
            {subscriptionType === 'free' && (
              <button
                onClick={() => navigate('/subscription')}
                className="bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm font-medium"
              >
                <Crown className="w-4 h-4 inline mr-2" />
                Actualizar
              </button>
            )}
          </div>
        </div>

        {/* Lista de productos */}
        {subscriptionType === 'free' ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Historial no disponible</h3>
            <p className="text-gray-600 mb-6">
              El historial de productos está disponible en los planes Premium y Pro.
              Actualiza tu plan para acceder a esta funcionalidad.
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              Ver Planes
            </button>
          </div>
        ) : historyProducts.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Productos Escaneados ({historyProducts.length})
                </h3>
                <span className="text-sm text-gray-500">
                  Límite: {subscriptionInfo.limit}
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {historyProducts.map((product, index) => (
                <div 
                  key={index} 
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {product.product_name?.charAt(0) || 'P'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-lg truncate">
                        {product.product_name || 'Producto sin nombre'}
                      </h4>
                      <p className="text-gray-600 truncate">
                        {product.brands || 'Marca no disponible'}
                      </p>
                      <div className="flex items-center mt-2">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {new Date(product.scannedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        product.nutriscore_grade === 'a' ? 'bg-green-500' :
                        product.nutriscore_grade === 'b' ? 'bg-yellow-500' :
                        product.nutriscore_grade === 'c' ? 'bg-orange-500' :
                        product.nutriscore_grade === 'd' ? 'bg-red-500' :
                        product.nutriscore_grade === 'e' ? 'bg-red-700' : 'bg-gray-500'
                      }`}>
                        {product.nutriscore_grade?.toUpperCase() || '?'}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {product.analysis?.recommendation?.includes('Recomendado') ? '✅' :
                           product.analysis?.recommendation?.includes('Moderado') ? '⚠️' : '❌'}
                        </div>
                        <div className="text-xs text-gray-500">Ver detalles</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sin productos escaneados</h3>
            <p className="text-gray-600 mb-6">
              Aún no has escaneado ningún producto. Comienza escaneando tu primer producto para ver el historial aquí.
            </p>
            <button
              onClick={() => navigate('/scanner')}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-3 px-8 rounded-2xl hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              Escanear Producto
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductHistory

