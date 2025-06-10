import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { usePremium } from '../contexts/PremiumContext'
import { useHealthProfile } from '../contexts/HealthProfileContext'
import { useProductHistory } from '../contexts/ProductHistoryContext'
import { toast } from 'react-toastify'
import { Camera, Upload, ArrowLeft, Zap, AlertCircle, CheckCircle, Brain, Heart, TrendingUp, AlertTriangle, ThumbsUp, ThumbsDown, Keyboard } from 'lucide-react'
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from 'html5-qrcode'

const Scanner = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { canScan, incrementDailyScans, subscriptionType } = usePremium()
  const { healthProfile } = useHealthProfile()
  const { addProductToHistory } = useProductHistory()
  const scannerRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState('')
  const [productInfo, setProductInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Manejar datos del historial
  useEffect(() => {
    if (location.state?.fromHistory && location.state?.productInfo) {
      setProductInfo(location.state.productInfo)
      setScannedCode(location.state.productInfo.barcode || '')
    }
  }, [location.state])

  useEffect(() => {
    return () => {
      if (isScanning) {
        stopScanning()
      }
    }
  }, [isScanning])

  const startScanning = async () => {
    if (!canScan()) {
      toast.error('Has alcanzado el límite de escaneos diarios')
      return
    }

    try {
      setIsScanning(true)
      setError('')
      
      // Verificar soporte de navegador
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara')
      }

      // Limpiar cualquier escáner previo
      const existingScanner = document.getElementById("qr-reader")
      if (existingScanner) {
        existingScanner.innerHTML = ''
      }

      // Configuración agresiva para cámara posterior automática SIN SELECTOR
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.777778,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: false,
        defaultZoomValueIfSupported: 1,
        rememberLastUsedCamera: false,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        // Configuración específica para AUTO-SELECCIONAR cámara posterior
        videoConstraints: {
          facingMode: 'environment', // Cámara posterior automática
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        },
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39
        ],
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        },
        // Configuración adicional para evitar selector de cámara
        disableFlip: false,
        verbose: false
      }

      // Crear escáner con configuración optimizada
      const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", config, false)
      
      // Función de éxito al escanear
      const onScanSuccess = (decodedText) => {
        setScannedCode(decodedText)
        searchProduct(decodedText)
        html5QrcodeScanner.clear()
        setIsScanning(false)
        toast.success('¡Código escaneado exitosamente!')
      }

      // Función de error (silenciosa para no molestar)
      const onScanFailure = (error) => {
        // Solo log, no mostrar errores continuos
        console.log('Escaneando...', error)
      }

      // Renderizar escáner
      html5QrcodeScanner.render(onScanSuccess, onScanFailure)
      
      // Intentar forzar cámara posterior después de renderizar
      setTimeout(() => {
        try {
          // Buscar y ocultar selector de cámara si aparece
          const cameraSelection = document.querySelector('#qr-reader select')
          if (cameraSelection) {
            cameraSelection.style.display = 'none'
            
            // Buscar opción de cámara posterior y seleccionarla automáticamente
            const options = cameraSelection.options
            for (let i = 0; i < options.length; i++) {
              const optionText = options[i].text.toLowerCase()
              if (optionText.includes('back') || optionText.includes('rear') || optionText.includes('environment')) {
                cameraSelection.selectedIndex = i
                cameraSelection.dispatchEvent(new Event('change'))
                break
              }
            }
          }

          // Ocultar cualquier UI de selección de cámara
          const cameraSelectionDiv = document.querySelector('#qr-reader__camera_selection')
          if (cameraSelectionDiv) {
            cameraSelectionDiv.style.display = 'none'
          }

          // Ocultar botones de cambio de cámara
          const switchButtons = document.querySelectorAll('#qr-reader button[title*="camera"], #qr-reader button[title*="Switch"]')
          switchButtons.forEach(button => {
            button.style.display = 'none'
          })

          // Ocultar cualquier dropdown o select de cámara
          const allSelects = document.querySelectorAll('#qr-reader select')
          allSelects.forEach(select => {
            select.style.display = 'none'
          })

          // Ocultar texto de selección de cámara
          const cameraTexts = document.querySelectorAll('#qr-reader span, #qr-reader label')
          cameraTexts.forEach(text => {
            if (text.textContent.toLowerCase().includes('camera') || 
                text.textContent.toLowerCase().includes('cámara') ||
                text.textContent.toLowerCase().includes('select')) {
              text.style.display = 'none'
            }
          })

        } catch (error) {
          console.log('Error configurando cámara automática:', error)
        }
      }, 1000)
      
      toast.success('Escáner activado. Apunta al código de barras')
      
    } catch (error) {
      console.error('Error al inicializar escáner:', error)
      setError(error.message || 'No se pudo acceder a la cámara. Verifica los permisos.')
      setIsScanning(false)
      toast.error(error.message || 'Error al acceder a la cámara')
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    setError('')
    // Limpiar el escáner html5-qrcode
    try {
      const scannerElement = document.getElementById("qr-reader")
      if (scannerElement) {
        scannerElement.innerHTML = ''
      }
    } catch (error) {
      console.log('Error limpiando escáner:', error)
    }
  }

  const searchProduct = async (barcode) => {
    setLoading(true)
    setError('')
    setProductInfo(null)

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      const data = await response.json()

      if (data.status === 1 && data.product) {
        const product = {
          name: data.product.product_name || 'Producto sin nombre',
          brand: data.product.brands || 'Marca no disponible',
          barcode: barcode,
          image: data.product.image_url,
          nutriscore: data.product.nutriscore_grade,
          nutrition: {
            energy: data.product.nutriments?.energy_100g || 0,
            fat: data.product.nutriments?.fat_100g || 0,
            carbohydrates: data.product.nutriments?.carbohydrates_100g || 0,
            sugars: data.product.nutriments?.sugars_100g || 0,
            proteins: data.product.nutriments?.proteins_100g || 0,
            salt: data.product.nutriments?.salt_100g || 0,
            fiber: data.product.nutriments?.fiber_100g || 0
          }
        }

        // Generar análisis personalizado
        const userConditions = healthProfile?.conditions || []
        const analysis = generateAnalysis(product, userConditions, subscriptionType)
        
        const productWithAnalysis = {
          ...product,
          analysis
        }
        
        setProductInfo(productWithAnalysis)
        
        // Guardar en historial
        addProductToHistory(product, analysis)
        
        incrementDailyScans()
        toast.success('Producto encontrado y analizado')
      } else {
        setError('Producto no encontrado en la base de datos')
        toast.error('Producto no encontrado')
      }
    } catch (error) {
      console.error('Error buscando producto:', error)
      setError('Error al buscar el producto')
      toast.error('Error al buscar el producto')
    } finally {
      setLoading(false)
    }
  }

  const generateAnalysis = (product, conditions, subscriptionType) => {
    const analysis = {
      recommendation: '',
      reasons: [],
      alternatives: [],
      aiInsights: '',
      detailedAnalysis: '',
      specificAnalysis: ''
    }

    // Análisis básico de salud
    const hasHighSugar = product.nutrition.sugars > 15
    const hasHighSodium = product.nutrition.salt > 1.5
    const hasHighSaturatedFat = product.nutrition.fat > 20

    // DIFERENCIACIÓN REAL POR PLAN
    switch (subscriptionType) {
      case 'free':
        // PLAN FREE: Solo recomendación básica SIN alternativas detalladas
        if (hasHighSugar || hasHighSodium || hasHighSaturatedFat) {
          analysis.recommendation = '❌ No recomendado'
          analysis.reasons = ['Alto contenido de ingredientes no saludables para tu perfil']
        } else {
          analysis.recommendation = '✅ Aceptable'
          analysis.reasons = ['Contenido nutricional dentro de rangos normales']
        }
        // FREE: Sin alternativas específicas, solo mensaje genérico
        analysis.alternatives = ['🔒 Desbloquea alternativas personalizadas con Premium', '🔒 Análisis detallado disponible en Premium']
        break

      case 'premium':
        // PLAN PREMIUM: Análisis detallado + alternativas específicas
        analysis.recommendation = hasHighSugar || hasHighSodium || hasHighSaturatedFat ? '⚠️ Consumir con moderación' : '✅ Recomendado'
        
        // Razones específicas por condición
        if (conditions.includes('diabetes') && hasHighSugar) {
          analysis.reasons.push('Alto en azúcares (puede afectar glucosa en sangre)')
        }
        if (conditions.includes('hipertension') && hasHighSodium) {
          analysis.reasons.push('Alto en sodio (puede elevar presión arterial)')
        }
        if (conditions.includes('colesterol_alto') && hasHighSaturatedFat) {
          analysis.reasons.push('Alto en grasas saturadas (puede afectar colesterol)')
        }
        
        if (analysis.reasons.length === 0) {
          analysis.reasons.push('Perfil nutricional adecuado para tus condiciones de salud')
        }

        // Alternativas específicas para Premium
        analysis.alternatives = generateAlternatives(conditions)
        break

      case 'pro':
        // PLAN PRO: Todo lo anterior + IA avanzada + análisis específico
        analysis.recommendation = hasHighSugar || hasHighSodium || hasHighSaturatedFat ? '❌ No recomendado' : '✅ Altamente recomendado'
        
        // Razones específicas por condición para PRO
        if (conditions.includes('diabetes') && hasHighSugar) {
          analysis.reasons.push('Alto en azúcares (puede afectar glucosa en sangre)')
        }
        if (conditions.includes('hipertension') && hasHighSodium) {
          analysis.reasons.push('Alto en sodio (puede elevar presión arterial)')
        }
        if (conditions.includes('colesterol_alto') && hasHighSaturatedFat) {
          analysis.reasons.push('Alto en grasas saturadas (puede afectar colesterol)')
        }
        
        if (analysis.reasons.length === 0) {
          analysis.reasons.push('Perfil nutricional excelente para tus condiciones de salud')
        }
        
        // Análisis específico por condición para PRO
        analysis.specificAnalysis = generateSpecificAnalysis(product, conditions)
        
        // IA Avanzada para PRO
        analysis.aiInsights = generateAIInsights(product, conditions)
        
        // Análisis nutricional detallado para PRO
        analysis.detailedAnalysis = generateDetailedAnalysis(product, conditions)
        
        // Alternativas ampliadas para PRO
        analysis.alternatives = generateAlternatives(conditions)
        break
    }

    return analysis
  }

  const generateAlternatives = (conditions) => {
    const alternatives = []
    
    if (conditions.includes('diabetes')) {
      alternatives.push(
        'Galletas integrales sin azúcar añadido',
        'Frutos secos naturales (almendras, nueces)',
        'Frutas frescas con fibra (manzana, pera)',
        'Yogur griego natural sin azúcar'
      )
    }
    
    if (conditions.includes('colesterol_alto')) {
      alternatives.push(
        'Galletas de avena con omega-3',
        'Frutos secos (nueces, almendras)',
        'Frutas deshidratadas sin azúcar',
        'Barras de cereales integrales'
      )
    }
    
    if (conditions.includes('hipertension')) {
      alternatives.push(
        'Galletas sin sal añadida',
        'Frutas frescas variadas',
        'Vegetales crujientes (zanahoria, apio)',
        'Frutos secos sin sal'
      )
    }
    
    // Alternativas generales si no hay condiciones específicas
    if (alternatives.length === 0) {
      alternatives.push(
        'Galletas integrales sin azúcar añadido',
        'Frutos secos naturales',
        'Frutas deshidratadas sin azúcar',
        'Barras de cereales integrales'
      )
    }
    
    return [...new Set(alternatives)].slice(0, 6)
  }

  const generateAIInsights = (product, conditions) => {
    const caloriesKcal = Math.round((product.nutrition.energy || 0) * 0.239)
    
    let insights = '🧠 **Tu Asistente Nutricional Inteligente**: '
    insights += `Este producto tiene ${caloriesKcal} calorías por 100g. `
    
    if (conditions.includes('diabetes')) {
      insights += `Como tienes diabetes, ten cuidado con los ${product.nutrition.carbohydrates}g de carbohidratos. `
    }
    
    if (conditions.includes('colesterol_alto')) {
      insights += `Las grasas saturadas (${product.nutrition.fat}g) pueden afectar tu colesterol. `
    }
    
    insights += `💡 Consejo: Busca alternativas con menos azúcar y más fibra.`
    
    return insights
  }

  const generateDetailedAnalysis = (product, conditions) => {
    const caloriesKcal = Math.round((product.nutrition.energy || 0) * 0.239)
    
    return `📊 **Análisis Nutricional Detallado**: 
    
• **Energía**: ${caloriesKcal} calorías por 100g
• **Carbohidratos**: ${product.nutrition.carbohydrates}g (energía rápida)
• **Proteínas**: ${product.nutrition.proteins}g (construcción muscular)
• **Grasas**: ${product.nutrition.fat}g (energía de reserva)
• **Azúcares**: ${product.nutrition.sugars}g (impacto glucémico)
• **Sal**: ${product.nutrition.salt}g (presión arterial)

💡 **Recomendación**: Este producto es ${caloriesKcal > 400 ? 'alto' : caloriesKcal > 200 ? 'moderado' : 'bajo'} en calorías.`
  }

  const generateSpecificAnalysis = (product, conditions) => {
    let specificAnalysis = ''
    
    if (conditions.includes('diabetes')) {
      specificAnalysis += `🩸 **Para tu Diabetes**: Los ${product.nutrition.carbohydrates}g de carbohidratos pueden elevar tu glucosa. Recomiendo máximo 1 porción y acompañar con proteína.\n\n`
    }
    
    if (conditions.includes('hipertension')) {
      specificAnalysis += `💓 **Para tu Hipertensión**: Este producto contiene ${product.nutrition.salt}g de sal. Tu límite diario recomendado es 5g total.\n\n`
    }
    
    if (conditions.includes('colesterol_alto')) {
      specificAnalysis += `🫀 **Para tu Colesterol**: Las ${product.nutrition.fat}g de grasas pueden afectar tus niveles. Prefiere opciones con menos grasas saturadas.\n\n`
    }
    
    return specificAnalysis || 'Análisis específico basado en tu perfil de salud.'
  }

  const handleManualInput = () => {
    const barcode = prompt('Ingresa el código de barras manualmente:')
    if (barcode && barcode.trim()) {
      setScannedCode(barcode.trim())
      searchProduct(barcode.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Volver</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Escáner de Productos</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Escáner */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Escanear Código de Barras</h2>
            <p className="text-gray-600">Apunta tu cámara al código de barras del producto</p>
          </div>

          {/* Contenedor del escáner */}
          <div className="scanner-section mb-6">
            <div id="qr-reader" className="w-full max-w-md mx-auto"></div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!isScanning ? (
              <>
                <button
                  onClick={startScanning}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium shadow-lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Iniciar Escáner
                </button>
                <button
                  onClick={handleManualInput}
                  className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                >
                  <Keyboard className="w-5 h-5 mr-2" />
                  Ingresar Código
                </button>
              </>
            ) : (
              <button
                onClick={stopScanning}
                className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Detener Escáner
              </button>
            )}
          </div>
        </div>

        {/* Resultado del análisis */}
        {loading && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analizando producto...</p>
            </div>
          </div>
        )}

        {productInfo && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Imagen del producto */}
              <div className="md:w-1/3">
                {productInfo.image ? (
                  <img
                    src={productInfo.image}
                    alt={productInfo.name}
                    className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-md"
                  />
                ) : (
                  <div className="w-full h-48 md:h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="md:w-2/3 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{productInfo.name}</h3>
                  <p className="text-gray-600">{productInfo.brand}</p>
                  <p className="text-sm text-gray-500">Código: {productInfo.barcode}</p>
                </div>

                {/* Nutri-Score */}
                {productInfo.nutriscore && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">Nutri-Score:</span>
                    <span className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
                      productInfo.nutriscore === 'a' ? 'bg-green-500' :
                      productInfo.nutriscore === 'b' ? 'bg-lime-500' :
                      productInfo.nutriscore === 'c' ? 'bg-yellow-500' :
                      productInfo.nutriscore === 'd' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}>
                      {productInfo.nutriscore.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Análisis personalizado */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <div className="flex items-center mb-3">
                    <Brain className="w-5 h-5 text-purple-600 mr-2" />
                    <h4 className="font-bold text-purple-900">Análisis Personalizado</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">Recomendación:</span>
                      <span className="font-bold">{productInfo.analysis.recommendation}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-1">Razones:</span>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {productInfo.analysis.reasons.map((reason, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Análisis específico para PRO */}
                    {productInfo.analysis.specificAnalysis && (
                      <div className="bg-white rounded-xl p-3 border border-purple-200">
                        <h5 className="font-bold text-purple-900 mb-2 flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          Análisis Específico para tu Salud
                        </h5>
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {productInfo.analysis.specificAnalysis}
                        </div>
                      </div>
                    )}

                    {/* IA Insights para PRO */}
                    {productInfo.analysis.aiInsights && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-200">
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {productInfo.analysis.aiInsights}
                        </div>
                      </div>
                    )}

                    {/* Análisis detallado para PRO */}
                    {productInfo.analysis.detailedAnalysis && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {productInfo.analysis.detailedAnalysis}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">Alternativas recomendadas:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {productInfo.analysis.alternatives.map((alternative, index) => (
                          <div key={index} className="bg-white rounded-lg p-2 border border-purple-200 text-sm text-gray-700">
                            {alternative}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información nutricional */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Información Nutricional (por 100g)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Energía:</span>
                      <span className="font-medium ml-1">{Math.round((productInfo.nutrition.energy || 0) * 0.239)} kcal</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Grasas:</span>
                      <span className="font-medium ml-1">{productInfo.nutrition.fat}g</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Carbohidratos:</span>
                      <span className="font-medium ml-1">{productInfo.nutrition.carbohydrates}g</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Azúcares:</span>
                      <span className="font-medium ml-1">{productInfo.nutrition.sugars}g</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Proteínas:</span>
                      <span className="font-medium ml-1">{productInfo.nutrition.proteins}g</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Sal:</span>
                      <span className="font-medium ml-1">{productInfo.nutrition.salt}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Scanner

