import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Lock, Database, Mail, Phone, MapPin, Calendar } from 'lucide-react'

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Política de Privacidad</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">NutriScan AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        
        {/* Información General */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Información General</h2>
          </div>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              <strong>NutriScan AI</strong> es una aplicación de análisis nutricional que respeta y protege la privacidad de sus usuarios. Esta política describe cómo recopilamos, usamos y protegemos su información personal.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Última actualización: Junio 2025</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">Versión 2.0 - Cumplimiento GDPR y LGPD</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Datos que Recopilamos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Datos que Recopilamos</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">📋 Información de Perfil de Salud (Opcional)</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Condiciones médicas seleccionadas (diabetes, hipertensión, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Objetivos nutricionales (pérdida de peso, ganancia muscular, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Alergias e intolerancias alimentarias</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🛒 Historial de Productos Escaneados</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Códigos de barras de productos consultados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Fechas y horas de escaneo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Análisis nutricionales generados</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">⚙️ Preferencias de la Aplicación</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Configuración de idioma y tema</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Preferencias de notificaciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Tipo de suscripción activa</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🔐 Datos de Autenticación (Si usa Google)</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Nombre y email de Google (solo para identificación)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>ID único de usuario (para sincronización)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cómo Protegemos sus Datos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cómo Protegemos sus Datos</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">🔒 Almacenamiento Local Seguro</h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Sus datos se almacenan localmente en su dispositivo usando tecnología de cifrado avanzado.
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🚫 Sin Venta de Datos</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Nunca vendemos, alquilamos o compartimos sus datos personales con terceros.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🔐 Cifrado de Información Sensible</h3>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Toda información médica y personal está cifrada con estándares AES-256.
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">🌐 Transmisión Segura</h3>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Todas las comunicaciones usan HTTPS y protocolos de seguridad modernos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sus Derechos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sus Derechos de Privacidad</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Acceso a sus Datos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Puede consultar qué datos tenemos sobre usted</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Rectificación</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Puede corregir datos incorrectos o incompletos</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Portabilidad</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Puede exportar sus datos en formato estándar</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Eliminación</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Puede solicitar la eliminación completa de sus datos</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Limitación</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Puede restringir el procesamiento de sus datos</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Oposición</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Puede oponerse al procesamiento de sus datos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uso de Datos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cómo Usamos sus Datos</h2>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Personalización de Análisis</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Utilizamos su perfil de salud para generar recomendaciones nutricionales específicas para sus condiciones médicas y objetivos.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📊 Mejora del Servicio</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Analizamos patrones de uso (de forma anónima) para mejorar la precisión de nuestros análisis y añadir nuevas funcionalidades.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔔 Comunicaciones Relevantes</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Enviamos consejos nutricionales personalizados y actualizaciones importantes (solo si acepta recibir notificaciones).
              </p>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Contacto para Privacidad</h2>
              <p className="text-blue-100">¿Preguntas sobre sus datos? Contáctenos</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="font-medium">Email de Privacidad</p>
                  <p className="text-blue-100">privacidad@nutriscan-ai.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="font-medium">Teléfono</p>
                  <p className="text-blue-100">+57 300 123 4567</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="font-medium">Dirección</p>
                  <p className="text-blue-100">Bogotá, Colombia</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="font-medium">Horario de Atención</p>
                  <p className="text-blue-100">Lun-Vie 9:00-18:00 COT</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cumplimiento Legal */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cumplimiento Legal</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">GDPR</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cumplimiento con regulaciones europeas</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">LGPD</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ley General de Protección de Datos (Brasil)</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">CCPA</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">California Consumer Privacy Act</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 NutriScan AI. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Última actualización: Junio 2025 • Versión 2.0
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy

