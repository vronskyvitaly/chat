// pages/api/auth/[...nextauth].ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { instance } from '@/common/axios-instanse'

interface UserSession {
  id: string
  isAdmin?: boolean
  name: string
  email: string
  createAt: string
  updateAt: string
}

type ResponseUser = Pick<UserSession, 'id' | 'email' | 'name'> & { accessToken: string; refreshToken: string }

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: 'sign-in'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null
          const res = await axios.post(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER}api/auth/login`, {
            email: credentials?.email,
            password: credentials?.password
          })

          // window.localStorage.setItem('accessToken', res.data.accessToken)

          // console.log('res.data', res.data)
          if (res) {
            return res.data
          }
        } catch (e: unknown) {
          console.log('error', e)
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      // console.log('session 33', token)
      try {
        // Получаем данные пользователя по email
        const res = await axios.get<undefined, { data: UserSession }>(
          `${process.env.NEXT_PUBLIC_EXPRESS_SERVER}api/user/${session?.user?.email}`
        )

        return {
          ...session,
          user: {
            ...session.user,
            name: res?.data?.name,
            id: res?.data?.id,
            isAdmin: res?.data?.isAdmin || false // Указываем значение по умолчанию
          }
        }
      } catch (e) {
        console.error('Error fetching user data:', e)
        return session // Возвращаем исходную сессию в случае ошибки
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as ResponseUser).accessToken
        token.refreshToken = (user as ResponseUser).refreshToken
        token.id = (user as ResponseUser).id
        token.name = (user as ResponseUser).name
      }
      return token
    }
  },

  session: {
    // Установил количество дней для сессии
    maxAge: 30 * 24 * 60 * 60, // 30 дней в секундах
    updateAge: 24 * 60 * 60 // Обновление сессии каждые 24 часа
  }
}
