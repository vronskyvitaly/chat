// middleware/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { cookies } from 'next/headers'
import { PATH } from '@/shared'

export default async function proxy(req: NextRequest) {
  // Получаем токен из next-auth
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  console.log('NextAuth token:', token)

  if (!token) {
    return NextResponse.redirect(new URL(PATH.SING_IN, req.nextUrl))
  }

  // Получаем accessToken из сессии next-auth
  const accessToken = token.accessToken as string
  const refreshToken = token.refreshToken as string
  // const userId = token.sub // sub содержит userId
  // const headersList = await headers()
  // const userAgent = headersList.set('authorization', `Bearer ${accessToken}`)
  const cookieStore = await cookies()
  cookieStore.set('accessToken', `${accessToken}`)
  cookieStore.set('refreshToken', `${refreshToken}`)

  // console.log('Access token:', accessToken)
  // console.log('User ID:', userId)

  return NextResponse.next({
    // headers: {
    //   authorization: `Bearer ${accessToken}`
    // }
  })
}

export const config = {
  matcher: ['/posts'] // Применяется ко всем маршрутам, начинающимся с /protected/
}
