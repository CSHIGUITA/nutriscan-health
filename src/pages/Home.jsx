import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useHealthProfile } from '../contexts/HealthProfileContext'
import { usePremium } from '../contexts/PremiumContext'
import { useProductHistory } from '../contexts/ProductHistoryContext'
import { Scan, Search, User, History, Settings, Crown, Zap } from 'lucide-react'

const Home = () => {
  const navigate = useNavigate()
  const { getCurrentUser } = useAuth()
  const { healthProfile } = useHealthProfile()
  const { subscriptionType, getRemainingScans, getSubscriptionFeatures } = usePremium()
  const { getProductHistory } = useProductHistory()
  
  const currentUser = getCurrentUser()
  const features = getSubscriptionFeatures()
  const recentProducts = getProductHistory(subscriptionType).slice(0, 3) // Mostrar últimos 3 productos según plan

  const handleScanProduct = () => {
    navigate('/scanner')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implementar búsqueda manual
    console.log('Búsqueda manual implementada')
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  // Función para obtener información de condiciones con colores y emojis
  const getConditionInfo = (condition) => {
    const conditionMap = {
      'diabetes': { 
        label: 'Diabetes', 
        emoji: '🩸', 
        color: 'bg-red-100 text-red-800 border-red-200' 
      },
      'hipertension': { 
        label: 'Hipertensión', 
        emoji: '💓', 
        color: 'bg-orange-100 text-orange-800 border-orange-200' 
      },
      'sin_vesicula': { 
        label: 'Sin vesícula', 
        emoji: '🫀', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
      },
      'intolerancia_lactosa': { 
        label: 'Intolerancia lactosa', 
        emoji: '🥛', 
        color: 'bg-blue-100 text-blue-800 border-blue-200' 
      },
      'celiaquia': { 
        label: 'Celiaquía', 
        emoji: '🌾', 
        color: 'bg-amber-100 text-amber-800 border-amber-200' 
      },
      'colesterol_alto': { 
        label: 'Colesterol alto', 
        emoji: '🧈', 
        color: 'bg-purple-100 text-purple-800 border-purple-200' 
      }
    }
    return conditionMap[condition] || { 
      label: condition, 
      emoji: '⚕️', 
      color: 'bg-gray-100 text-gray-800 border-gray-200' 
    }
  }

  // Función para obtener información de objetivos con colores y emojis
  const getGoalInfo = (goal) => {
    const goalMap = {
      'perder_peso': { 
        label: 'Perder peso', 
        emoji: '⚖️', 
        color: 'bg-green-100 text-green-800 border-green-200' 
      },
      'ganar_masa_muscular': { 
        label: 'Ganar músculo', 
        emoji: '💪', 
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200' 
      },
      'alimentacion_balanceada': { 
        label: 'Alimentación balanceada', 
        emoji: '🥗', 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200' 
      },
      'reducir_azucar': { 
        label: 'Reducir azúcar', 
        emoji: '🍯', 
        color: 'bg-pink-100 text-pink-800 border-pink-200' 
      },
      'reducir_sodio': { 
        label: 'Reducir sodio', 
        emoji: '🧂', 
        color: 'bg-cyan-100 text-cyan-800 border-cyan-200' 
      },
      'aumentar_fibra': { 
        label: 'Aumentar fibra', 
        emoji: '🌿', 
        color: 'bg-lime-100 text-lime-800 border-lime-200' 
      }
    }
    return goalMap[goal] || { 
      label: goal, 
      emoji: '🎯', 
      color: 'bg-gray-100 text-gray-800 border-gray-200' 
    }
  }

  const getHealthSummary = () => {
    if (!healthProfile?.conditions?.length && !healthProfile?.goals?.length) {
      return 'Perfil no configurado'
    }
    
    const conditions = healthProfile.conditions || []
    const goals = healthProfile.goals || []
    
    return `${conditions.length} condición(es), ${goals.length} objetivo(s)`
  }

  const getDailyTip = () => {
    const userConditions = healthProfile?.conditions || []
    const today = new Date().getDate() // Cambia cada día del mes
    
    // Consejos generales
    const generalTips = [
      "💡 Lee siempre las etiquetas nutricionales. Busca productos con menos de 5 ingredientes.",
      "🥗 Incluye al menos 5 porciones de frutas y verduras en tu día.",
      "💧 Bebe 8 vasos de agua al día para mantener tu cuerpo hidratado.",
      "🚶‍♀️ Camina 30 minutos diarios para mejorar tu salud cardiovascular.",
      "🍎 Prefiere snacks naturales como frutas, nueces o yogur natural.",
      "⏰ Come cada 3-4 horas para mantener estables tus niveles de energía.",
      "🥛 Elige lácteos bajos en grasa o alternativas vegetales fortificadas.",
      "🍞 Prefiere cereales integrales sobre los refinados para más fibra."
    ]
    
    // Consejos específicos por condición
    const diabetesTips = [
      "🩸 Para diabetes: Controla las porciones de carbohidratos en cada comida.",
      "🩸 Para diabetes: Prefiere alimentos con índice glucémico bajo como avena y legumbres.",
      "🩸 Para diabetes: Evita bebidas azucaradas, mejor agua con limón o té sin azúcar."
    ]
    
    const hypertensionTips = [
      "💓 Para hipertensión: Reduce el sodio eligiendo productos con menos de 140mg por porción.",
      "💓 Para hipertensión: Incluye alimentos ricos en potasio como plátanos y espinacas.",
      "💓 Para hipertensión: Limita los alimentos procesados y embutidos."
    ]
    
    const cholesterolTips = [
      "🧈 Para colesterol alto: Elige grasas saludables como aguacate, nueces y aceite de oliva.",
      "🧈 Para colesterol alto: Incluye avena y legumbres que ayudan a reducir el colesterol.",
      "🧈 Para colesterol alto: Limita las grasas saturadas y evita las grasas trans."
    ]
    
    // Seleccionar consejo según condiciones del usuario
    let availableTips = [...generalTips]
    
    if (userConditions.includes('diabetes')) {
      availableTips = [...availableTips, ...diabetesTips]
    }
    
    if (userConditions.includes('hipertension')) {
      availableTips = [...availableTips, ...hypertensionTips]
    }
    
    if (userConditions.includes('colesterol_alto')) {
      availableTips = [...availableTips, ...cholesterolTips]
    }
    
    // Seleccionar tip basado en el día (cambia diariamente)
    const tipIndex = today % availableTips.length
    return availableTips[tipIndex]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {getGreeting()}, {currentUser?.email?.split('@')[0] || 'Usuario'}
            </h1>
            <p className="text-sm text-gray-600">
              {subscriptionType === 'free' ? `${getRemainingScans()} escaneos restantes hoy` : 'Escaneos ilimitados'}
            </p>
          </div>
          
          {subscriptionType === 'free' && (
            <button
              onClick={() => navigate('/subscription')}
              className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Búsqueda */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar producto por nombre..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-green-700 transition-all font-medium"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Escáner Principal */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Scan className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Escanear Producto</h2>
            <p className="text-green-100 mb-6">
              Apunta tu cámara al código de barras para obtener información nutricional
            </p>
            <button
              onClick={handleScanProduct}
              className="bg-white text-green-600 font-bold py-4 px-8 rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center justify-center">
                <Scan className="w-5 h-5 mr-2" />
                Iniciar Escáner
              </div>
            </button>
          </div>
        </div>

        {/* Perfil de Salud */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Perfil de Salud</h3>
                <p className="text-gray-600">{getHealthSummary()}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              {healthProfile?.conditions?.length ? 'Editar' : 'Configurar'}
            </button>
          </div>
          
          {/* Condiciones activas con diseño mejorado */}
          {healthProfile?.conditions?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Condiciones activas:</h4>
              <div className="flex flex-wrap gap-2">
                {healthProfile.conditions.slice(0, 3).map((condition, index) => {
                  const conditionInfo = getConditionInfo(condition)
                  return (
                    <div 
                      key={index} 
                      className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium ${conditionInfo.color} border shadow-sm`}
                    >
                      <span className="mr-2">{conditionInfo.emoji}</span>
                      <span>{conditionInfo.label}</span>
                    </div>
                  )
                })}
                {healthProfile.conditions.length > 3 && (
                  <div className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 border shadow-sm">
                    +{healthProfile.conditions.length - 3} más
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Objetivos activos con diseño mejorado */}
          {healthProfile?.goals?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Objetivos nutricionales:</h4>
              <div className="flex flex-wrap gap-2">
                {healthProfile.goals.slice(0, 2).map((goal, index) => {
                  const goalInfo = getGoalInfo(goal)
                  return (
                    <div 
                      key={index} 
                      className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium ${goalInfo.color} border shadow-sm`}
                    >
                      <span className="mr-2">{goalInfo.emoji}</span>
                      <span>{goalInfo.label}</span>
                    </div>
                  )
                })}
                {healthProfile.goals.length > 2 && (
                  <div className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 border shadow-sm">
                    +{healthProfile.goals.length - 2} más
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Estado cuando no hay condiciones */}
          {(!healthProfile?.conditions?.length && !healthProfile?.goals?.length) && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">Configura tu perfil de salud para recibir recomendaciones personalizadas</p>
              <button
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all transform hover:scale-105 font-medium"
              >
                Configurar Perfil
              </button>
            </div>
          )}
        </div>

        {/* Productos Recientes */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                <History className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Productos Recientes</h3>
                <p className="text-gray-600 hidden sm:block">Historial de escaneos</p>
              </div>
            </div>
          </div>
          
          {recentProducts.length > 0 ? (
            <div className="space-y-3">
              {recentProducts.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                     onClick={() => {
                       // Navegar directamente al producto con su información
                       navigate('/scanner', { 
                         state: { 
                           productInfo: item,
                           analysis: item.analysis,
                           fromHistory: true 
                         } 
                       })
                     }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {item.product_name?.charAt(0) || 'P'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{item.product_name || 'Producto sin nombre'}</h4>
                    <p className="text-xs text-gray-500 truncate">{item.brands || 'Marca no disponible'}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(item.scannedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                    item.nutriscore_grade === 'a' ? 'bg-green-500' :
                    item.nutriscore_grade === 'b' ? 'bg-yellow-500' :
                    item.nutriscore_grade === 'c' ? 'bg-orange-500' :
                    item.nutriscore_grade === 'd' ? 'bg-red-500' :
                    item.nutriscore_grade === 'e' ? 'bg-red-700' : 'bg-gray-500'
                  }`}>
                    {item.nutriscore_grade?.toUpperCase() || '?'}
                  </div>
                </div>
              ))}
              {subscriptionType !== 'free' && (
                <button
                  onClick={() => navigate('/history')}
                  className="w-full text-center text-green-600 font-medium py-2 hover:text-green-700 transition-colors"
                >
                  Ver historial completo
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              {subscriptionType === 'free' ? (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">El historial está disponible en planes Premium y Pro</p>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
                  >
                    Actualizar Plan
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">Aún no has escaneado productos</p>
                  <button
                    onClick={handleScanProduct}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    Escanear Primer Producto
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Consejos Nutricionales */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 backdrop-blur-sm flex-shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold">Consejo del Día</h3>
              <p className="text-purple-100 text-xs sm:text-sm">Recomendación personalizada</p>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-2xl p-3 sm:p-4 backdrop-blur-sm border border-white/30 shadow-lg">
            <div className="min-h-[120px] sm:min-h-[140px] flex items-start">
              <p className="text-white font-medium leading-relaxed text-sm sm:text-base break-words whitespace-pre-wrap w-full">
                {getDailyTip()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button
            onClick={() => navigate('/home')}
            className="flex flex-col items-center py-2 px-4 text-blue-600"
          >
            <Scan className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Inicio</span>
          </button>
          
          <button
            onClick={() => navigate('/scanner')}
            className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Search className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Escáner</span>
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Perfil</span>
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Ajustes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home

