// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Секретный ключ для подписи токенов
const SECRET_KEY = 'ваш_секретный_ключ'

export const verifyToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return reject(err)
      }
      resolve(decoded)
    })
  })
}

export default async function proxy(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  try {
    await verifyToken(token)
    return NextResponse.next()
  } catch (error) {
    console.error('Token verification failed:', error)
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
}

export const config = {
  matcher: ['/test/:path*'] // Применяется ко всем маршрутам, начинающимся с /protected/
}
