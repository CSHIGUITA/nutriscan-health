import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useHealthProfile } from '../contexts/HealthProfileContext'
import { toast } from 'react-toastify'
import { User, Heart, Target, Save, LogOut } from 'lucide-react'

const Profile = () => {
  const navigate = useNavigate()
  const { user, localProfile, signOut } = useAuth()
  const { healthProfile, updateHealthProfile, loading: profileLoading } = useHealthProfile()
  
  const [selectedConditions, setSelectedConditions] = useState([])
  const [selectedGoals, setSelectedGoals] = useState([])
  const [saving, setSaving] = useState(false)

  // Cargar datos existentes
  useEffect(() => {
    if (healthProfile && !profileLoading) {
      setSelectedConditions(healthProfile.conditions || [])
      setSelectedGoals(healthProfile.goals || [])
    }
  }, [healthProfile, profileLoading])

  // Condiciones de salud disponibles
  const healthConditions = [
    { id: 'diabetes', label: 'Diabetes', emoji: '🩸', color: 'bg-red-100 border-red-300' },
    { id: 'hipertension', label: 'Hipertensión', emoji: '💓', color: 'bg-orange-100 border-orange-300' },
    { id: 'sin_vesicula', label: 'Sin vesícula', emoji: '🫀', color: 'bg-purple-100 border-purple-300' },
    { id: 'intolerancia_lactosa', label: 'Intolerancia a lactosa', emoji: '🥛', color: 'bg-blue-100 border-blue-300' },
    { id: 'celiaquia', label: 'Celiaquía', emoji: '🌾', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'colesterol_alto', label: 'Colesterol alto', emoji: '🧈', color: 'bg-pink-100 border-pink-300' }
  ]

  // Condiciones adicionales (mostrar cuando se hace clic en "Otras")
  const additionalConditions = [
    { id: 'gastritis', label: 'Gastritis', emoji: '🔥', color: 'bg-red-100 border-red-300' },
    { id: 'reflujo', label: 'Reflujo gastroesofágico', emoji: '🌋', color: 'bg-orange-100 border-orange-300' },
    { id: 'colon_irritable', label: 'Síndrome de colon irritable', emoji: '🌪️', color: 'bg-purple-100 border-purple-300' },
    { id: 'hipotiroidismo', label: 'Hipotiroidismo', emoji: '🦋', color: 'bg-blue-100 border-blue-300' },
    { id: 'hipertiroidismo', label: 'Hipertiroidismo', emoji: '⚡', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'anemia', label: 'Anemia', emoji: '🩸', color: 'bg-red-100 border-red-300' },
    { id: 'osteoporosis', label: 'Osteoporosis', emoji: '🦴', color: 'bg-gray-100 border-gray-300' },
    { id: 'artritis', label: 'Artritis', emoji: '🦴', color: 'bg-orange-100 border-orange-300' },
    { id: 'higado_graso', label: 'Hígado graso', emoji: '🫘', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'insuficiencia_renal', label: 'Insuficiencia renal', emoji: '🫘', color: 'bg-blue-100 border-blue-300' },
    { id: 'gota', label: 'Gota', emoji: '💎', color: 'bg-purple-100 border-purple-300' },
    { id: 'fibromialgia', label: 'Fibromialgia', emoji: '💫', color: 'bg-pink-100 border-pink-300' },
    { id: 'migranas', label: 'Migrañas', emoji: '🧠', color: 'bg-indigo-100 border-indigo-300' },
    { id: 'depresion', label: 'Depresión', emoji: '🌧️', color: 'bg-gray-100 border-gray-300' },
    { id: 'ansiedad', label: 'Ansiedad', emoji: '😰', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'insomnio', label: 'Insomnio', emoji: '🌙', color: 'bg-indigo-100 border-indigo-300' },
    { id: 'acne', label: 'Acné', emoji: '🔴', color: 'bg-red-100 border-red-300' },
    { id: 'psoriasis', label: 'Psoriasis', emoji: '🌿', color: 'bg-green-100 border-green-300' },
    { id: 'eczema', label: 'Eczema', emoji: '🌸', color: 'bg-pink-100 border-pink-300' },
    { id: 'menopausia', label: 'Menopausia', emoji: '🌺', color: 'bg-purple-100 border-purple-300' }
  ]

  const [showAdditionalConditions, setShowAdditionalConditions] = useState(false)

  // Objetivos nutricionales disponibles
  const nutritionalGoals = [
    { id: 'perder_peso', label: 'Perder peso', emoji: '⚖️', color: 'bg-green-100 border-green-300' },
    { id: 'ganar_masa_muscular', label: 'Ganar masa muscular', emoji: '💪', color: 'bg-blue-100 border-blue-300' },
    { id: 'alimentacion_balanceada', label: 'Alimentación balanceada', emoji: '🥗', color: 'bg-emerald-100 border-emerald-300' },
    { id: 'reducir_azucar', label: 'Reducir azúcar', emoji: '🍯', color: 'bg-amber-100 border-amber-300' },
    { id: 'reducir_sodio', label: 'Reducir sodio', emoji: '🧂', color: 'bg-gray-100 border-gray-300' },
    { id: 'aumentar_fibra', label: 'Aumentar fibra', emoji: '🥕', color: 'bg-orange-100 border-orange-300' }
  ]

  const handleConditionToggle = (conditionId) => {
    setSelectedConditions(prev => 
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    )
  }

  const handleGoalToggle = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    
    try {
      const { error } = await updateHealthProfile({
        conditions: selectedConditions,
        goals: selectedGoals
      })

      if (error) {
        toast.error('Error al guardar perfil: ' + error.message)
        return
      }

      toast.success('Perfil guardado correctamente')
      navigate('/home')
    } catch (error) {
      console.error('Error al guardar perfil:', error)
      toast.error('Error al guardar perfil')
    } finally {
      setSaving(false)
    }
  }

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

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mi Perfil de Salud</h1>
                <p className="text-blue-100">
                  {user ? user.email : localProfile ? 'Usuario Local' : 'Configura tu perfil'}
                </p>
              </div>
            </div>
            
            {user && (
              <button
                onClick={handleSignOut}
                className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Condiciones de Salud */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Condiciones de Salud</h2>
              <p className="text-gray-600">Selecciona las que apliquen a tu caso</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {healthConditions.map(condition => (
              <button
                key={condition.id}
                onClick={() => handleConditionToggle(condition.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedConditions.includes(condition.id)
                    ? `${condition.color} border-opacity-100 shadow-md transform scale-105`
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{condition.emoji}</span>
                  <span className="font-medium text-gray-900">{condition.label}</span>
                </div>
              </button>
            ))}
            
            {/* Botón "Otras" */}
            <button
              onClick={() => setShowAdditionalConditions(!showAdditionalConditions)}
              className="p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 text-left bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center justify-center">
                <span className="text-2xl mr-3">➕</span>
                <span className="font-medium text-gray-700">
                  {showAdditionalConditions ? 'Ocultar otras' : 'Otras condiciones'}
                </span>
              </div>
            </button>
          </div>

          {/* Condiciones adicionales */}
          {showAdditionalConditions && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Condiciones adicionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {additionalConditions.map(condition => (
                  <button
                    key={condition.id}
                    onClick={() => handleConditionToggle(condition.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedConditions.includes(condition.id)
                        ? `${condition.color} border-opacity-100 shadow-md transform scale-105`
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{condition.emoji}</span>
                      <span className="font-medium text-gray-900">{condition.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Objetivos Nutricionales */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Objetivos Nutricionales</h2>
              <p className="text-gray-600">¿Qué quieres lograr con tu alimentación?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nutritionalGoals.map(goal => (
              <button
                key={goal.id}
                onClick={() => handleGoalToggle(goal.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedGoals.includes(goal.id)
                    ? `${goal.color} border-opacity-100 shadow-md transform scale-105`
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{goal.emoji}</span>
                  <span className="font-medium text-gray-900">{goal.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="text-center">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]"
          >
            {saving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Guardando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Save className="w-5 h-5 mr-2" />
                Guardar Perfil
              </div>
            )}
          </button>
          
          <p className="text-gray-600 mt-4 text-sm">
            Tu perfil se guardará y podrás comenzar a escanear productos
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile

