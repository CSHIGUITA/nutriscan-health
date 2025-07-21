import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [localProfile, setLocalProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('nutriscan_user')
    const savedLocalProfile = localStorage.getItem('nutriscan_local_profile')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedLocalProfile) {
      setLocalProfile(JSON.parse(savedLocalProfile))
    }
    
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    try {
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('nutriscan_user', JSON.stringify(userData))
      
      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signUp = async (email, password) => {
    try {
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('nutriscan_user', JSON.stringify(userData))
      
      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      // Crear una ventana popup para simular Google OAuth
      const popup = window.open(
        'about:blank',
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      )

      // Crear contenido HTML para simular pantalla de Google
      const googleAuthHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Iniciar sesión - Cuentas de Google</title>
          <style>
            body {
              font-family: 'Google Sans', Roboto, Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .container {
              max-width: 400px;
              padding: 40px;
              border: 1px solid #dadce0;
              border-radius: 8px;
              text-align: center;
            }
            .logo {
              width: 75px;
              height: 24px;
              margin-bottom: 16px;
            }
            h1 {
              font-size: 24px;
              font-weight: 400;
              margin: 0 0 8px 0;
              color: #202124;
            }
            p {
              font-size: 16px;
              color: #5f6368;
              margin: 0 0 24px 0;
            }
            input {
              width: 100%;
              padding: 13px 15px;
              border: 1px solid #dadce0;
              border-radius: 4px;
              font-size: 16px;
              margin-bottom: 16px;
              box-sizing: border-box;
            }
            input:focus {
              outline: none;
              border-color: #1a73e8;
              box-shadow: 0 1px 6px rgba(32,33,36,.28);
            }
            .btn {
              background: #1a73e8;
              color: white;
              border: none;
              padding: 9px 24px;
              border-radius: 4px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              width: 100%;
              margin-top: 16px;
            }
            .btn:hover {
              background: #1557b0;
            }
            .btn:disabled {
              background: #dadce0;
              color: #5f6368;
              cursor: not-allowed;
            }
            .error {
              color: #d93025;
              font-size: 14px;
              margin-top: 8px;
              display: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <svg class="logo" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
              <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
              <path fill="#FBBC05" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
              <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
              <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
            </svg>
            <h1>Iniciar sesión</h1>
            <p>Continúa en NutriScan</p>
            
            <form id="googleForm">
              <input type="email" id="email" placeholder="Correo electrónico o teléfono" required>
              <input type="password" id="password" placeholder="Contraseña" required>
              <div class="error" id="error">Correo electrónico o contraseña incorrectos</div>
              <button type="submit" class="btn" id="submitBtn">Siguiente</button>
            </form>
          </div>

          <script>
            document.getElementById('googleForm').addEventListener('submit', function(e) {
              e.preventDefault();
              
              const email = document.getElementById('email').value;
              const password = document.getElementById('password').value;
              const submitBtn = document.getElementById('submitBtn');
              const errorDiv = document.getElementById('error');
              
              if (!email || !password) {
                errorDiv.style.display = 'block';
                return;
              }
              
              submitBtn.disabled = true;
              submitBtn.textContent = 'Iniciando sesión...';
              
              // Simular proceso de autenticación
              setTimeout(() => {
                const userData = {
                  id: 'google_' + Date.now(),
                  email: email,
                  name: email.split('@')[0],
                  provider: 'google',
                  avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
                  createdAt: new Date().toISOString()
                };
                
                // Enviar datos al padre
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'GOOGLE_AUTH_SUCCESS',
                    user: userData
                  }, '*');
                }
                
                window.close();
              }, 2000);
            });
          </script>
        </body>
        </html>
      `

      popup.document.write(googleAuthHTML)
      popup.document.close()

      // Escuchar el mensaje del popup
      return new Promise((resolve, reject) => {
        const messageHandler = (event) => {
          if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            const userData = event.data.user
            setUser(userData)
            localStorage.setItem('nutriscan_user', JSON.stringify(userData))
            window.removeEventListener('message', messageHandler)
            resolve({ user: userData, error: null })
          }
        }

        window.addEventListener('message', messageHandler)

        // Verificar si el popup se cerró sin completar
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed)
            window.removeEventListener('message', messageHandler)
            reject(new Error('Popup cerrado sin completar autenticación'))
          }
        }, 1000)
      })

    } catch (error) {
      return { user: null, error }
    }
  }

  const signOut = async () => {
    try {
      setUser(null)
      setLocalProfile(null)
      localStorage.removeItem('nutriscan_user')
      localStorage.removeItem('nutriscan_local_profile')
      localStorage.removeItem('nutriscan_health_profile')
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const continueWithoutAccount = () => {
    const localUserData = {
      id: 'local_' + Date.now(),
      email: null,
      name: 'Usuario Local',
      isLocal: true,
      createdAt: new Date().toISOString()
    }
    
    setLocalProfile(localUserData)
    localStorage.setItem('nutriscan_local_profile', JSON.stringify(localUserData))
    
    return { user: localUserData, error: null }
  }

  const isAuthenticated = () => {
    return !!(user || localProfile)
  }

  const getCurrentUser = () => {
    return user || localProfile
  }

  const value = {
    user,
    localProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    continueWithoutAccount,
    isAuthenticated,
    getCurrentUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Exportación por defecto del contexto
export default AuthContext
