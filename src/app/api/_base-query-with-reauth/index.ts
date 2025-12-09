import {
  type BaseQueryFn,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { PATH } from '@/common'
import { handleError } from '@/app/api/_handle-error'

const isBrowser = typeof window !== 'undefined'

/**
 * Получение токена из cookies
 */
const getAccessToken = (): string | null => {
  if (isBrowser) {
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
  }
  return null
}

/**
 * Получение refresh token из cookies
 */
const getRefreshToken = (): string | null => {
  if (isBrowser) {
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
  }
  return null
}

/**
 * Установка access token в cookie
 */
const setAccessToken = (token: string): void => {
  if (isBrowser) {
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 минут
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure; SameSite=Strict' : ''
    document.cookie = `accessToken=${token}; path=/; expires=${expires.toUTCString()}${secureFlag}`
  }
}

/**
 * Установка refresh token в cookie
 */
const setRefreshToken = (token: string): void => {
  if (isBrowser) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure; SameSite=Strict' : ''
    document.cookie = `refreshToken=${token}; path=/; expires=${expires.toUTCString()}${secureFlag}`
  }
}

/**
 * Удаление токенов из cookies
 */
const clearTokens = (): void => {
  if (isBrowser) {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

const mutex = new Mutex()

/** Базовый запрос с авторизацией */
const base = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_EXPRESS_SERVER,
  prepareHeaders: headers => {
    const token = getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    // RTK Query сам определяет Content-Type
    return headers
  },
  paramsSerializer: params => {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          searchParams.append(key, String(item))
        })
      } else if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    })

    return searchParams.toString()
  }
})

/** Обёртка с логикой рефреша через cookies */
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Если кто-то уже рефрешит — ждём
  await mutex.waitForUnlock()

  // основной запрос
  let result = await base(args, api, extraOptions)

  handleError(result)

  // Обрабатываем 401 ошибку (неавторизован)
  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshToken = getRefreshToken()

        if (!refreshToken) {
          console.warn('No refresh token available')
          // Перенаправляем на страницу входа если нет refresh token
          if (isBrowser) {
            clearTokens()
            window.location.href = '/login'
          }
          return result
        }

        // Запрашиваем новые токены
        const refreshResult = await base(
          {
            url: 'api/auth/token/refresh',
            method: 'POST',
            body: { refreshToken }
          },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as {
            accessToken: string
            refreshToken: string
          }

          // Сохраняем новые токены в cookies
          setAccessToken(accessToken)
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken)
          }

          // Повтор запроса с новым токеном
          result = await base(args, api, extraOptions)
        } else {
          // Если рефреш не удался - очищаем токены и перенаправляем на логин
          console.log('Logout: refresh token invalid or expired')
          clearTokens()
          if (isBrowser) {
            window.location.href = PATH.SING_IN
          }
        }
      } catch (e) {
        console.error('Token refresh failed:', e)
        clearTokens()
        if (isBrowser) {
          window.location.href = PATH.SING_IN
        }
      } finally {
        release()
      }
    } else {
      // Ждем пока другой запрос завершит рефреш
      await mutex.waitForUnlock()
      result = await base(args, api, extraOptions)
    }
  }

  return result
}

// // Дополнительные утилиты для работы с токенами
// export const tokenUtils = {
//   getAccessToken,
//   getRefreshToken,
//   setAccessToken,
//   setRefreshToken,
//   clearTokens
// }
