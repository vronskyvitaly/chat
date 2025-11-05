'use client'
// pages/register.tsx
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  console.log('RegisterPage', process.env.NEXT_PUBLIC_EXPRESS_SERVER)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER}api/auth/register`, {
        name,
        email,
        password
      })

      // Если регистрация успешна, перенаправляем на другую страницу
      if (response.status === 201) {
        router.push('/login') // Перенаправление на страницу входа
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <h1 className='text-3xl font-semibold mb-6'>Регистрация</h1>
      {error && <p className='text-red-500'>{error}</p>}
      <form onSubmit={handleSubmit} className='w-full max-w-sm bg-white p-6 rounded shadow-md'>
        <div className='mb-4'>
          <label className='block text-gray-700' htmlFor='name'>
            Имя
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='border border-gray-300 rounded p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700' htmlFor='email'>
            Email
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='border border-gray-300 rounded p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700' htmlFor='password'>
            Пароль
          </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='border border-gray-300 rounded p-2 w-full'
            required
          />
        </div>
        <button type='submit' className='bg-blue-500 text-white rounded px-4 py-2'>
          Зарегистрироваться
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
