import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode'
import { Camera, ArrowLeft, Search, Loader2, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { usePremium } from '../contexts/PremiumContext'
import { useProductHistory } from '../contexts/ProductHistoryContext'
import { useHealthProfile } from '../contexts/HealthProfileContext'

const Scanner = () => {
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const { canScan, incrementDailyScans, subscriptionType } = usePremium()
  const { addProductToHistory } = useProductHistory()
  const { healthProfile } = useHealthProfile()

  // Base de datos ampliada de productos
  const productDatabase = {
    '7501000673209': {
      name: 'Galletas con salvado y miel',
      brand: 'Tosh',
      image: 'https://via.placeholder.com/200x200?text=Tosh+Galletas',
      nutrition: {
        calories: 450,
        protein: 8.5,
        carbs: 65,
        fat: 16,
        fiber: 4.2,
        sugar: 18,
        sodium: 380
      },
      ingredients: ['Harina de trigo', 'Azúcar', 'Aceite vegetal', 'Salvado de trigo', 'Miel', 'Sal'],
      allergens: ['Gluten', 'Puede contener trazas de soya']
    },
    '7501000673216': {
      name: 'Galletas Marías',
      brand: 'Gamesa',
      image: 'https://via.placeholder.com/200x200?text=Gamesa+Marias',
      nutrition: {
        calories: 420,
        protein: 7,
        carbs: 70,
        fat: 12,
        fiber: 2,
        sugar: 15,
        sodium: 320
      },
      ingredients: ['Harina de trigo', 'Azúcar', 'Aceite vegetal', 'Sal'],
      allergens: ['Gluten']
    },
    '7501000673223': {
      name: 'Coca Cola Original',
      brand: 'Coca Cola',
      image: 'https://via.placeholder.com/200x200?text=Coca+Cola',
      nutrition: {
        calories: 140,
        protein: 0,
        carbs: 39,
        fat: 0,
        fiber: 0,
        sugar: 39,
        sodium: 45
      },
      ingredients: ['Agua carbonatada', 'Azúcar', 'Concentrado de cola', 'Ácido fosfórico'],
      allergens: []
    }
  }

  useEffect(() => {
    return () => {
      cleanupScanner()
    }
  }, [])

  const cleanupScanner = async () => {
    try {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.getState() === Html5Qrcode.STATE_SCANNING) {
          await html5QrCodeRef.current.stop()
        }
        await html5QrCodeRef.current.clear()
        html5QrCodeRef.current = null
      }
    } catch (error) {
      console.log('Cleanup error:', error)
    }
  }

  const startScanner = async () => {
    if (!canScan()) {
      toast.error(`Límite diario alcanzado. Plan ${subscriptionType}: ${subscriptionType === 'free' ? '3' : subscriptionType === 'premium' ? '50' : '∞'} escaneos/día`)
      return
    }

    try {
      setIsScanning(true)
      setCameraError(null)
      
      // Limpiar scanner anterior
      await cleanupScanner()

      // Crear nuevo scanner
      html5QrCodeRef.current = new Html5Qrcode("qr-reader")

      // Obtener cámaras disponibles
      const devices = await Html5Qrcode.getCameras()
      
      if (devices && devices.length > 0) {
        // Buscar cámara posterior
        let cameraId = devices[0].id // Por defecto la primera
        
        // Intentar encontrar cámara posterior
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        )
        
        if (backCamera) {
          cameraId = backCamera.id
        } else if (devices.length > 1) {
          // Si hay múltiples cámaras, usar la segunda (generalmente es la posterior)
          cameraId = devices[1].id
        }

        // Configuración de la cámara
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          // Configuración para mejor rendimiento
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        }

        // Iniciar scanner
        await html5QrCodeRef.current.start(
          cameraId,
          config,
          (decodedText) => {
            handleScanSuccess(decodedText)
          },
          (error) => {
            // Silenciar errores comunes de escaneo
            if (!error.includes('NotFoundException') && 
                !error.includes('No MultiFormat Readers') &&
                !error.includes('No code found')) {
              console.warn('Scanner error:', error)
            }
          }
        )

        // Aplicar estilos después de iniciar
        setTimeout(() => {
          const videoElement = document.querySelector('#qr-reader video')
          if (videoElement) {
            videoElement.style.borderRadius = '12px'
            videoElement.style.width = '100%'
            videoElement.style.height = 'auto'
          }
          
          const scannerElement = document.getElementById('qr-reader')
          if (scannerElement) {
            scannerElement.style.border = '2px solid #3b82f6'
            scannerElement.style.borderRadius = '12px'
            scannerElement.style.overflow = 'hidden'
          }
        }, 1000)

      } else {
        throw new Error('No se encontraron cámaras disponibles')
      }

    } catch (error) {
      console.error('Error starting scanner:', error)
      setIsScanning(false)
      setCameraError(error.message)
      
      if (error.message.includes('Permission denied')) {
        toast.error('Permisos de cámara denegados. Por favor, permite el acceso a la cámara.')
      } else if (error.message.includes('NotFoundError')) {
        toast.error('No se encontró ninguna cámara en el dispositivo.')
      } else {
        toast.error('Error al iniciar el escáner: ' + error.message)
      }
    }
  }

  const stopScanner = async () => {
    try {
      await cleanupScanner()
    } catch (error) {
      console.log('Error stopping scanner:', error)
    } finally {
      setIsScanning(false)
      setCameraError(null)
    }
  }

  const handleScanSuccess = async (barcode) => {
    setIsLoading(true)
    incrementDailyScans()
    
    try {
      await stopScanner()
      await searchProduct(barcode)
    } catch (error) {
      toast.error('Error al procesar el código escaneado')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSearch = async () => {
    if (!manualCode.trim()) {
      toast.error('Ingresa un código de barras')
      return
    }

    if (!canScan()) {
      toast.error(`Límite diario alcanzado. Plan ${subscriptionType}`)
      return
    }

    setIsLoading(true)
    incrementDailyScans()
    
    try {
      await searchProduct(manualCode.trim())
    } catch (error) {
      toast.error('Error al buscar el producto')
    } finally {
      setIsLoading(false)
    }
  }

  const searchProduct = async (barcode) => {
    // Buscar en base de datos local primero
    let productData = productDatabase[barcode]
    
    if (!productData) {
      // Buscar en OpenFoodFacts API
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
        const data = await response.json()
        
        if (data.status === 1 && data.product) {
          const product = data.product
          productData = {
            name: product.product_name || 'Producto sin nombre',
            brand: product.brands || 'Marca desconocida',
            image: product.image_url || 'https://via.placeholder.com/200x200?text=Sin+Imagen',
            nutrition: {
              calories: product.nutriments?.['energy-kcal_100g'] || 0,
              protein: product.nutriments?.proteins_100g || 0,
              carbs: product.nutriments?.carbohydrates_100g || 0,
              fat: product.nutriments?.fat_100g || 0,
              fiber: product.nutriments?.fiber_100g || 0,
              sugar: product.nutriments?.sugars_100g || 0,
              sodium: product.nutriments?.sodium_100g || 0
            },
            ingredients: product.ingredients_text ? product.ingredients_text.split(',').map(i => i.trim()) : [],
            allergens: product.allergens_tags || []
          }
        }
      } catch (error) {
        console.error('Error fetching from OpenFoodFacts:', error)
      }
    }

    if (!productData) {
      toast.error('Producto no encontrado. Intenta con otro código.')
      return
    }

    setProduct(productData)
    
    // Generar análisis personalizado
    const analysisResult = generateAnalysis(productData, healthProfile, subscriptionType)
    setAnalysis(analysisResult)
    
    // Guardar en historial
    addProductToHistory(productData, analysisResult)
    
    toast.success('¡Producto encontrado!')
  }

  const generateAnalysis = (product, profile, plan) => {
    const conditions = profile?.conditions || []
    const objectives = profile?.objectives || []
    
    let score = 70 // Score base
    let recommendations = []
    let warnings = []
    let alternatives = []

    // Análisis por condiciones de salud
    if (conditions.includes('diabetes')) {
      if (product.nutrition.sugar > 15) {
        score -= 30
        warnings.push('Alto contenido de azúcar - No recomendado para diabetes')
      }
    }

    if (conditions.includes('hipertension')) {
      if (product.nutrition.sodium > 300) {
        score -= 25
        warnings.push('Alto contenido de sodio - Evitar con hipertensión')
      }
    }

    if (conditions.includes('celiaquia')) {
      if (product.allergens.includes('Gluten')) {
        score = 0
        warnings.push('CONTIENE GLUTEN - NO CONSUMIR')
      }
    }

    // Análisis por objetivos
    if (objectives.includes('bajar_peso')) {
      if (product.nutrition.calories > 400) {
        score -= 20
        recommendations.push('Alto en calorías - Consumir con moderación')
      }
    }

    if (objectives.includes('ganar_masa_muscular')) {
      if (product.nutrition.protein > 10) {
        score += 15
        recommendations.push('Buen contenido proteico para ganancia muscular')
      }
    }

    // Alternativas según plan
    if (plan === 'premium' || plan === 'pro') {
      alternatives = [
        'Galletas integrales sin azúcar añadido',
        'Barras de granola caseras',
        'Frutos secos naturales'
      ]
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      level: score >= 70 ? 'good' : score >= 40 ? 'moderate' : 'poor',
      recommendations,
      warnings,
      alternatives: plan === 'free' ? [] : alternatives,
      analysis: plan === 'free' ? 'Análisis básico disponible' : 'Análisis completo personalizado'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/home')}
            className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Escáner</h1>
          <div className="w-10"></div>
        </div>

        {/* Scanner Section */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div className="text-center mb-6">
            <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Escanear Producto
            </h2>
            <p className="text-gray-600">
              Apunta la cámara al código de barras del producto
            </p>
          </div>

          {!isScanning ? (
            <div>
              <button
                onClick={startScanner}
                disabled={!canScan()}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {canScan() ? 'Iniciar Escáner' : 'Límite diario alcanzado'}
              </button>
              
              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <p className="text-red-600 text-sm">
                    <strong>Error de cámara:</strong> {cameraError}
                  </p>
                  <p className="text-red-500 text-xs mt-2">
                    Asegúrate de permitir el acceso a la cámara en tu navegador.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div id="qr-reader" className="mb-4 rounded-xl overflow-hidden min-h-[300px] bg-gray-100 flex items-center justify-center">
                {/* El scanner se renderizará aquí */}
                <div className="text-gray-500">Iniciando cámara...</div>
              </div>
              <button
                onClick={stopScanner}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Detener Escáner
              </button>
            </div>
          )}
        </div>

        {/* Manual Input */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Búsqueda Manual
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ingresa código de barras"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleManualSearch}
              disabled={isLoading || !canScan()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Product Results */}
        {product && analysis && (
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-xl object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x200?text=Sin+Imagen'
                }}
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <p className="text-gray-600">{product.brand}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                  analysis.level === 'good' ? 'bg-green-100 text-green-800' :
                  analysis.level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Score: {analysis.score}/100
                </div>
              </div>
            </div>

            {/* Warnings */}
            {analysis.warnings.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-red-600 mb-2">⚠️ Advertencias:</h4>
                {analysis.warnings.map((warning, index) => (
                  <p key={index} className="text-red-600 text-sm mb-1">• {warning}</p>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-blue-600 mb-2">💡 Recomendaciones:</h4>
                {analysis.recommendations.map((rec, index) => (
                  <p key={index} className="text-blue-600 text-sm mb-1">• {rec}</p>
                ))}
              </div>
            )}

            {/* Alternatives */}
            {analysis.alternatives.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-600 mb-2">🔄 Alternativas:</h4>
                {analysis.alternatives.map((alt, index) => (
                  <p key={index} className="text-green-600 text-sm mb-1">• {alt}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Scanner
