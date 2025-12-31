'use server'
import { cookies } from 'next/headers'

export const getCookie = async (name: string) => {
  const cookieStore = await cookies()
  if (cookieStore.has(name)) {
    try {
      return cookieStore.get(name)?.value
    } catch (error) {
      console.error('Error reading cookie:', error)
    }
  }
  return undefined
}
