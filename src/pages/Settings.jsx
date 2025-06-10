import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { usePremium } from '../contexts/PremiumContext'
import { toast } from 'react-toastify'
import { 
  ArrowLeft, 
  User, 
  Crown, 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Check
} from 'lucide-react'

const Settings = () => {
  const navigate = useNavigate()
  const { user, localProfile, signOut } = useAuth()
  const { subscriptionType, getSubscriptionFeatures, cancelSubscription } = usePremium()
  
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('es')

  const handleToggleNotifications = (enabled) => {
    setNotifications(enabled)
    localStorage.setItem('notifications', enabled.toString())
    
    if (enabled) {
      // Solicitar permisos de notificación
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            toast.success('Notificaciones activadas')
            // Enviar notificación de prueba
            new Notification('NutriScan AI', {
              body: '¡Notificaciones activadas correctamente!',
              icon: '/icon-192x192.png'
            })
          } else {
            toast.warning('Permisos de notificación denegados')
            setNotifications(false)
            localStorage.setItem('notifications', 'false')
          }
        })
      } else {
        toast.error('Tu navegador no soporta notificaciones')
        setNotifications(false)
        localStorage.setItem('notifications', 'false')
      }
    } else {
      toast.success('Notificaciones desactivadas')
    }
  }

  const handleToggleDarkMode = (enabled) => {
    setDarkMode(enabled)
    if (enabled) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
      toast.success('Modo oscuro activado')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
      toast.success('Modo oscuro desactivado')
    }
  }

  // Cargar preferencias al iniciar
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    const savedNotifications = localStorage.getItem('notifications') !== 'false' // Default true
    const savedLanguage = localStorage.getItem('language') || 'Español'
    
    setDarkMode(savedDarkMode)
    setNotifications(savedNotifications)
    setLanguage(savedLanguage)
    
    // Aplicar modo oscuro inmediatamente
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [])

  const currentUser = user || localProfile
  const features = getSubscriptionFeatures()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Sesión cerrada correctamente')
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  const handleCancelSubscription = async () => {
    if (subscriptionType === 'free') {
      toast.info('Ya tienes el plan gratuito')
      return
    }

    const confirmed = window.confirm('¿Estás seguro de que quieres cancelar tu suscripción?')
    if (confirmed) {
      try {
        const { success, error } = await cancelSubscription()
        if (success) {
          toast.success('Suscripción cancelada correctamente')
        } else {
          toast.error('Error al cancelar suscripción: ' + error?.message)
        }
      } catch (error) {
        console.error('Error canceling subscription:', error)
        toast.error('Error inesperado al cancelar suscripción')
      }
    }
  }

  const getSubscriptionBadge = () => {
    const badges = {
      free: { text: 'Gratuito', color: 'bg-gray-100 text-gray-800' },
      premium: { text: 'Premium', color: 'bg-blue-100 text-blue-800' },
      pro: { text: 'Pro', color: 'bg-purple-100 text-purple-800' }
    }
    return badges[subscriptionType] || badges.free
  }

  const settingSections = [
    {
      title: 'Cuenta',
      items: [
        {
          icon: <User className="w-5 h-5" />,
          label: 'Perfil de Usuario',
          value: currentUser?.email || 'Usuario Local',
          action: () => navigate('/profile')
        },
        {
          icon: <Crown className="w-5 h-5" />,
          label: 'Suscripción',
          value: getSubscriptionBadge().text,
          action: () => navigate('/subscription'),
          badge: getSubscriptionBadge().color
        }
      ]
    },
    {
      title: 'Preferencias',
      items: [
        {
          icon: <Bell className="w-5 h-5" />,
          label: 'Notificaciones',
          value: notifications ? 'Activadas' : 'Desactivadas',
          toggle: true,
          checked: notifications,
          onChange: handleToggleNotifications
        },
        {
          icon: <Moon className="w-5 h-5" />,
          label: 'Modo Oscuro',
          value: darkMode ? 'Activado' : 'Desactivado',
          toggle: true,
          checked: darkMode,
          onChange: handleToggleDarkMode
        },
        {
          icon: <Globe className="w-5 h-5" />,
          label: 'Idioma',
          value: language,
          action: () => {
            const languages = ['Español', 'English', 'Português', 'Français']
            const currentIndex = languages.indexOf(language)
            const nextIndex = (currentIndex + 1) % languages.length
            const newLanguage = languages[nextIndex]
            setLanguage(newLanguage)
            localStorage.setItem('language', newLanguage)
            toast.success(`Idioma cambiado a ${newLanguage}`)
          }
        }
      ]
    },
    {
      title: 'Soporte',
      items: [
        {
          icon: <HelpCircle className="w-5 h-5" />,
          label: 'Centro de Ayuda',
          action: () => navigate('/support')
        },
        {
          icon: <Shield className="w-5 h-5" />,
          label: 'Política de Privacidad',
          action: () => navigate('/privacy')
        }  ]
    }
  ]

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
          <div>
            <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
            <p className="text-sm text-gray-600">Personaliza tu experiencia</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Información de la cuenta */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {currentUser?.email?.split('@')[0] || 'Usuario Local'}
                </h2>
                <p className="text-blue-100">
                  {currentUser?.email || 'Cuenta local'}
                </p>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-xl font-medium ${getSubscriptionBadge().color}`}>
              {getSubscriptionBadge().text}
            </div>
          </div>
        </div>

        {/* Estado de la suscripción */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Estado de Suscripción</h3>
            <Crown className="w-6 h-6 text-purple-600" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Características Actuales:</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Escaneos: {features.scans}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Análisis: {features.analysis}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Historial: {features.history}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Anuncios: {features.ads}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {subscriptionType === 'free' ? (
                <button
                  onClick={() => navigate('/subscription')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  Actualizar a Premium
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/subscription')}
                    className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Gestionar Suscripción
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                  >
                    Cancelar Suscripción
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secciones de configuración */}
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.label}</h4>
                        {item.value && (
                          <p className="text-sm text-gray-600">{item.value}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {item.badge && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium mr-3 ${item.badge}`}>
                          {item.value}
                        </span>
                      )}
                      
                      {item.toggle ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(e) => item.onChange(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      ) : item.action ? (
                        <button
                          onClick={item.action}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Cerrar sesión */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center py-4 px-6 bg-red-50 text-red-600 font-medium rounded-2xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </button>
        </div>

        {/* Información de la app */}
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">
            NutriScan AI v1.0.0
          </p>
          <p className="text-gray-400 text-xs mt-1">
            © 2025 NutriScan AI. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings

