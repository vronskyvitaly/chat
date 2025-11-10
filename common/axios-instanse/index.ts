import axios from 'axios'

const isBrowser = typeof window !== 'undefined'

// Улучшенная функция для получения токена из cookies
const getToken = (tokenName: string): string | null => {
  if (!isBrowser) return null

  try {
    const name = tokenName + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(';')

    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].trim()
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length)
      }
    }
    return null
  } catch (error) {
    console.error('Error reading cookie:', error)
    return null
  }
}

// Создаем экземпляр axios
export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EXPRESS_SERVER,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Интерцептор запросов
instance.interceptors.request.use(
  config => {
    const token = getToken('accessToken')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Интерцептор ответов для обработки 401 ошибок и обновления токенов
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Проверяем, что мы в браузере и получили 401
    if (isBrowser && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getToken('refreshToken')

        if (refreshToken) {
          // Запрашиваем новый access token
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_EXPRESS_SERVER}api/auth/token/refresh`,
            { refreshToken }
          )

          const { accessToken } = response.data

          // Обновляем access token в cookie
          const expires = new Date(Date.now() + 15 * 60 * 1000) // 1 минут
          document.cookie = `accessToken=${accessToken}; path=/; expires=${expires.toUTCString()}; ${process.env.NODE_ENV === 'production' ? 'Secure; SameSite=Strict' : ''}`

          // Устанавливаем новый токен в заголовок
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

          // Повторяем оригинальный запрос
          return instance(originalRequest)
        }
      } catch (refreshError) {
        console.error('Ошибка обновления токена:', refreshError)
        // Если не удалось обновить токен, перенаправляем на страницу входа
        if (isBrowser) {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
