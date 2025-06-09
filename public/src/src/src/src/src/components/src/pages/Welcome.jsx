import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Scan, Heart, Zap } from 'lucide-react'

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Scan className="w-10 h-10 text-white" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NutriScan AI</h1>
        <p className="text-gray-600 mb-8">Tu asistente nutricional personal</p>

        {/* Descripción */}
        <p className="text-gray-700 mb-8 leading-relaxed">
          Escanea productos y recibe recomendaciones personalizadas según tus condiciones de salud.
        </p>

        {/* Características */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center text-left">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <Scan className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Rápido</h3>
              <p className="text-sm text-gray-600">Escanea códigos de barras al instante</p>
            </div>
          </div>

          <div className="flex items-center text-left">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Personal</h3>
              <p className="text-sm text-gray-600">Recomendaciones según tu salud</p>
            </div>
          </div>

          <div className="flex items-center text-left">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Saludable</h3>
              <p className="text-sm text-gray-600">Toma mejores decisiones alimentarias</p>
            </div>
          </div>
        </div>

        {/* Botón principal */}
        <button
          onClick={() => navigate('/auth')}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
        >
          Empezar ahora
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Gratis • Sin compromisos • Fácil de usar
        </p>
      </div>
    </div>
  )
}

export default Welcome
