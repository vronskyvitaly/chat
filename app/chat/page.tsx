// pages/chat.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'

const ChatPage = () => {
  const { data } = useSession()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([]) // Изменяем тип на объект
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Устанавливаем соединение с WebSocket сервером
    wsRef.current = new WebSocket(`${process.env.NEXT_PUBLIC_EXPRESS_URL_WS as string}chat`)

    wsRef.current.onmessage = event => {
      const data = JSON.parse(event.data) // Парсим входящие данные
      if (data.type === 'message') {
        setMessages(prevMessages => [...prevMessages, { username: data.username, message: data.message! }]) // Добавляем имя и сообщение
      }
    }

    return () => {
      // Закрываем соединение при размонтировании компонента
      wsRef.current?.close()
    }
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (wsRef.current && message.trim() !== '') {
      const messageData = {
        type: 'message', // Указываем тип сообщения
        username: data?.user?.name || 'Anonymous', // Используем правильное имя
        message: message,
        id: '' // ID не нужен на клиенте
      }
      wsRef.current.send(JSON.stringify(messageData))
      setMessage('') // Очищаем поле ввода
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black'>
      <h1 className='text-3xl font-semibold text-black dark:text-zinc-50'>Chat Room</h1>

      <div className='w-full max-w-lg p-4 bg-white rounded shadow-lg mt-4'>
        <div className='h-64 overflow-y-auto border border-gray-300 rounded p-2'>
          {messages.map((msg, index) => (
            <div key={index} className='p-1 text-left text-black'>
              <strong>{msg.username}:</strong> {msg.message} {/* Отображаем имя пользователя и сообщение */}
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className='flex mt-2'>
          <input
            type='text'
            placeholder='Type your message...'
            value={message}
            onChange={e => setMessage(e.target.value)}
            className='border-t border-b border-l rounded-r-md p-2 flex-grow text-black'
          />
          <button type='submit' className='bg-blue-500 text-white rounded-md px-4 py-2 ml-2'>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatPage
