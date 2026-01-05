import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { cookies } from 'next/headers'
import { PATH } from '@/common/constants'

export default async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  console.log('NextAuth token:', token)

  if (!token) {
    return NextResponse.redirect(new URL(PATH.SING_IN, req.nextUrl))
  }

  const accessToken = token.accessToken as string
  const refreshToken = token.refreshToken as string
  // const userId = token.sub // sub содержит userId
  // const headersList = await headers()
  // const userAgent = headersList.set('authorization', `Bearer ${accessToken}`)
  const cookieStore = await cookies()
  cookieStore.set('accessToken', `${accessToken}`)
  cookieStore.set('refreshToken', `${refreshToken}`)
  cookieStore.set('userId', `${token.id}`)

  return NextResponse.next()
}

export const config = {
  matcher: ['/posts', '/', '/chat'] // Применяется ко всем маршрутам, начинающимся с /protected/
}
