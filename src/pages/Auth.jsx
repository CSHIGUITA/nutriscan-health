import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import GoogleAuthButton from '../components/GoogleAuthButton'

const Auth = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { signIn, signUp, continueWithoutAccount } = useAuth()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { email, password } = formData

      if (!email || !password) {
        toast.error('Por favor completa todos los campos')
        return
      }

      const result = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password)

      if (result.error) {
        toast.error('Error en la autenticación')
      } else {
        toast.success(isLogin ? '¡Bienvenido!' : '¡Cuenta creada exitosamente!')
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Error en la autenticación')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = (user) => {
    toast.success(`¡Bienvenido ${user.name}!`)
    navigate('/profile')
  }

  const handleGoogleError = (error) => {
    toast.error('Error al iniciar sesión con Google')
    console.error('Google Auth Error:', error)
  }

  const handleContinueWithoutAccount = () => {
    continueWithoutAccount()
    toast.success('Continuando sin cuenta')
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Volver</h1>
          <div className="w-10"></div>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenido de nuevo
            </h2>
            <p className="text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">o</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Auth Button */}
          <GoogleAuthButton 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

          {/* Continue Without Account */}
          <button
            onClick={handleContinueWithoutAccount}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
          >
            <User className="w-5 h-5" />
            Continuar sin cuenta
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Al continuar sin cuenta, tus datos se guardarán localmente en tu dispositivo
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
