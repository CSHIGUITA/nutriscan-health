import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Scan, Heart, Zap } from 'lucide-react'

const Welcome = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Scan className="w-8 h-8 text-green-600" />,
      title: "Rápido",
      description: "Escanea códigos de barras al instante"
    },
    {
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      title: "Personal",
      description: "Recomendaciones según tu salud"
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      title: "Saludable",
      description: "Toma mejores decisiones alimentarias"
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Scan className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NutriScan AI</h1>
          <p className="text-gray-600 leading-relaxed">
            Tu asistente nutricional personal
          </p>
        </div>

        {/* Descripción */}
        <div className="mb-8">
          <p className="text-gray-700 mb-6 leading-relaxed">
            Escanea productos y recibe recomendaciones personalizadas según tus condiciones de salud.
          </p>
        </div>

        {/* Características */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-2 border border-gray-100">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600 leading-tight">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Botón principal */}
        <button
          onClick={() => navigate('/auth')}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Empezar ahora
        </button>

        {/* Texto adicional */}
        <p className="text-xs text-gray-500 mt-4">
          Gratis • Sin compromisos • Fácil de usar
        </p>
      </div>
    </div>
  )
}

export default Welcome

