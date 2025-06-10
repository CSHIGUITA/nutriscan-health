import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePremium } from '../contexts/PremiumContext'
import { toast } from 'react-toastify'
import { Crown, Check, Zap, Star, ArrowLeft } from 'lucide-react'

const Subscription = () => {
  const navigate = useNavigate()
  const { subscriptionType, upgradeSubscription } = usePremium()

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      period: 'Siempre',
      color: 'from-gray-500 to-gray-600',
      features: [
        '5 escaneos diarios',
        'Información nutricional básica',
        'Perfil de salud simple',
        'Anuncios discretos',
        'Soporte de comunidad'
      ],
      limitations: [
        'Límite de escaneos',
        'Funciones básicas',
        'Con anuncios'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 3.99,
      period: 'mes',
      yearlyPrice: 33.99,
      color: 'from-blue-600 to-purple-600',
      popular: true,
      features: [
        'Escaneos ilimitados',
        'Análisis nutricional avanzado',
        'Seguimiento de objetivos',
        'Historial completo',
        'Sin anuncios',
        'Comparación de productos',
        'Soporte por email'
      ],
      benefits: [
        'Ahorra 50% anual',
        'Análisis detallado',
        'Sin interrupciones'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 7.99,
      period: 'mes',
      yearlyPrice: 67.99,
      color: 'from-purple-600 to-pink-600',
      features: [
        'Todo lo de Premium',
        'Análisis con IA avanzada',
        'Recomendaciones personalizadas',
        'Exportación de datos',
        'Soporte prioritario',
        'Funciones experimentales',
        'Consultas nutricionales',
        'API de terceros'
      ],
      benefits: [
        'IA más potente',
        'Soporte VIP',
        'Acceso anticipado'
      ]
    }
  ]

  const handleUpgrade = async (planId, billingCycle = 'monthly') => {
    if (planId === 'free') {
      toast.info('Ya tienes el plan gratuito')
      return
    }

    try {
      const { success, error } = await upgradeSubscription(planId, billingCycle)
      
      if (success) {
        toast.success(`¡Bienvenido a ${planId === 'premium' ? 'Premium' : 'Pro'}!`)
        navigate('/home')
      } else {
        toast.error('Error al procesar la suscripción: ' + error?.message)
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      toast.error('Error inesperado al procesar la suscripción')
    }
  }

  const getCurrentPlanFeatures = () => {
    return plans.find(plan => plan.id === subscriptionType)?.features || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <button
            onClick={() => navigate('/home')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Planes y Suscripciones</h1>
            <p className="text-sm text-gray-600">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Header de suscripciones */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Desbloquea Todo el Potencial de NutriScan AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Obtén análisis nutricionales avanzados, escaneos ilimitados y recomendaciones personalizadas
          </p>
        </div>

        {/* Planes */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'border-purple-500 shadow-purple-200' : 'border-gray-200'
              } ${subscriptionType === plan.id ? 'ring-4 ring-green-500 ring-opacity-50' : ''}`}
            >
              {/* Badge de popular */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Más Popular
                  </div>
                </div>
              )}

              {/* Badge de plan actual */}
              {subscriptionType === plan.id && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Actual
                  </div>
                </div>
              )}

              {/* Header del plan */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {plan.id === 'free' && <Zap className="w-8 h-8 text-white" />}
                  {plan.id === 'premium' && <Crown className="w-8 h-8 text-white" />}
                  {plan.id === 'pro' && <Star className="w-8 h-8 text-white" />}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-4">
                  {plan.price === 0 ? (
                    <div className="text-3xl font-bold text-gray-900">Gratis</div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        ${plan.price}
                        <span className="text-lg text-gray-600">/{plan.period}</span>
                      </div>
                      {plan.yearlyPrice && (
                        <div className="text-sm text-green-600 font-medium">
                          o ${plan.yearlyPrice}/año (ahorra 30%)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Características */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Botón de acción */}
              <div className="space-y-3">
                {subscriptionType === plan.id ? (
                  <div className="w-full bg-green-100 text-green-800 font-bold py-3 px-6 rounded-2xl text-center">
                    Plan Actual
                  </div>
                ) : (
                  <>
                    {plan.price > 0 && (
                      <button
                        onClick={() => handleUpgrade(plan.id, 'monthly')}
                        className={`w-full bg-gradient-to-r ${plan.color} text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105`}
                      >
                        Suscribirse Mensual
                      </button>
                    )}
                    
                    {plan.yearlyPrice && (
                      <button
                        onClick={() => handleUpgrade(plan.id, 'yearly')}
                        className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-2xl hover:bg-gray-200 transition-colors"
                      >
                        Suscribirse Anual (30% OFF)
                      </button>
                    )}
                    
                    {plan.price === 0 && subscriptionType !== 'free' && (
                      <button
                        onClick={() => handleUpgrade('free')}
                        className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-2xl hover:bg-gray-200 transition-colors"
                      >
                        Cambiar a Gratuito
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Garantía y beneficios */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir NutriScan AI Premium?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Análisis Instantáneo</h4>
                <p className="text-gray-600">
                  Obtén información nutricional detallada al instante con nuestro motor de IA
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Recomendaciones Personalizadas</h4>
                <p className="text-gray-600">
                  Recibe sugerencias adaptadas a tus condiciones de salud y objetivos
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Soporte Premium</h4>
                <p className="text-gray-600">
                  Acceso prioritario a nuestro equipo de expertos en nutrición
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Garantía */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Garantía de 30 Días</h3>
          <p className="text-green-100 text-lg">
            Si no estás completamente satisfecho, te devolvemos tu dinero sin preguntas
          </p>
        </div>
      </div>
    </div>
  )
}

export default Subscription

