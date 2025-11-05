'use client'
import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null) // Для хранения ошибок аутентификации

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Сбросим ошибку перед новой попыткой входа
    setError(null)

    // Используем функцию signIn для аутентификации
    const result = await signIn('credentials', {
      redirect: false, // Не перенаправляем автоматически
      email,
      password
    })

    // Проверяем результат аутентификации
    if (result?.error) {
      setError(result.error) // Устанавливаем ошибку, если аутентификация не удалась
    } else {
      // Если аутентификация успешна, можно перенаправить пользователя
      window.location.href = '/' // Перенаправляем на главную страницу
    }
  }
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start'>
        {/* Форма регистрации */}
        <form className='flex flex-col gap-4 w-full max-w-xs' onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Your email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='border rounded-md p-2'
            required
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='border rounded-md p-2'
            required
          />
          {error && <p className='text-red-500'>{error}</p>} {/* Отображаем ошибку, если она есть */}
          <button
            type='submit'
            className='flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]'
          >
            Register
          </button>
        </form>
      </main>
    </div>
  )
}
