// pages/chat.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'

interface ChatMessage {
  id: string
  username: string
  message: string
  userId?: string
  timestamp: number
}

interface WebSocketMessage {
  type: 'message'
  username: string
  message: string
  id: string
  userId: string
  timestamp: number
}

interface HistoryMessage {
  type: 'history'
  history: ChatMessage[]
}

type SocketMessage = WebSocketMessage | HistoryMessage

const ChatPage = () => {
  const { data: session, status } = useSession()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasScrolledToBottomRef = useRef(true)
  const lastScrollTopRef = useRef(0)
  const connectAttemptsRef = useRef(0)
  const maxAttempts = 5

  // Получаем данные пользователя из сессии
  const user = session?.user
  const userId = user?.id || user?.email || 'anonymous'

  const connectWebSocket = () => {
    // Проверяем статус сессии перед подключением
    if (status === 'loading') {
      console.log('Session is still loading, waiting...')
      return
    }

    if (status === 'unauthenticated') {
      console.error('User is not authenticated')
      setConnectionError('You must be logged in to use the chat')
      setIsLoading(false)
      return
    }

    // Проверяем максимальное количество попыток подключения
    if (connectAttemptsRef.current >= maxAttempts) {
      console.error('Maximum connection attempts reached')
      setConnectionError('Failed to connect to chat server after multiple attempts')
      setIsLoading(false)
      return
    }

    // Проверяем существующее соединение
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        return
      }
    }

    // Инкрементируем счетчик попыток
    connectAttemptsRef.current++
    console.log(`Connection attempt #${connectAttemptsRef.current}`)

    // Проверяем наличие URL
    const wsBaseUrl = process.env.NEXT_PUBLIC_EXPRESS_URL_WS
    if (!wsBaseUrl) {
      console.error('WebSocket URL is not defined in environment variables')
      setConnectionError('Chat server configuration error')
      setIsLoading(false)
      return
    }

    // Создаем WebSocket соединение
    const wsUrl = `${wsBaseUrl}chat`
    console.log('Connecting to WebSocket:', wsUrl)

    try {
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully')
        setIsConnected(true)
        setConnectionError(null)
        connectAttemptsRef.current = 0 // Сбрасываем счетчик при успешном подключении

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }
      }

      wsRef.current.onmessage = event => {
        try {
          const data: SocketMessage = JSON.parse(event.data)
          console.log('Received WebSocket message:', data)

          if (data.type === 'history') {
            // Обрабатываем историю сообщений
            const historyData = data as HistoryMessage
            console.log('Loading history with', historyData.history.length, 'messages')

            // Сортируем историю по времени (старые сверху, новые снизу)
            const sortedHistory = [...historyData.history].sort((a, b) => a.timestamp - b.timestamp)
            setMessages(sortedHistory)
            setIsLoading(false)
            setConnectionError(null)

            // Прокручиваем вниз после загрузки истории
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
              hasScrolledToBottomRef.current = true
            }, 100)
          } else if (data.type === 'message') {
            // Обрабатываем новое сообщение
            const messageData = data as WebSocketMessage
            const newMessage: ChatMessage = {
              id: messageData.id,
              username: messageData.username,
              message: messageData.message,
              userId: messageData.userId,
              timestamp: messageData.timestamp
            }

            console.log('Adding new message:', newMessage)
            setMessages(prev => {
              const updatedMessages = [...prev, newMessage]
              // Сортируем после добавления нового сообщения
              return updatedMessages.sort((a, b) => a.timestamp - b.timestamp)
            })

            // Прокручиваем вниз, только если пользователь был внизу
            setTimeout(() => {
              const container = messagesContainerRef.current
              if (container && hasScrolledToBottomRef.current) {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
            }, 10)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      wsRef.current.onerror = error => {
        console.error('WebSocket error:', error)
        // Не устанавливаем isConnected в false здесь, так как onclose будет вызван позже
        setConnectionError('Connection error. Retrying...')
      }

      wsRef.current.onclose = event => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setConnectionError('Connection lost. Reconnecting...')

        // Автоматическое переподключение
        if (event.code !== 1000 && event.code !== 1005) {
          // 1000 = нормальное закрытие, 1005 = отсутствие статуса
          reconnectTimeoutRef.current = setTimeout(
            () => {
              console.log('Attempting to reconnect...')
              connectWebSocket()
            },
            Math.min(connectAttemptsRef.current * 2000, 10000)
          ) // Экспоненциальная задержка, максимум 10 сек
        }
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      setConnectionError('Failed to create connection')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Подключаемся только когда сессия загружена
    if (status !== 'loading') {
      connectWebSocket()
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting')
      }
      // Сбрасываем состояние при размонтировании
      connectAttemptsRef.current = 0
    }
  }, [status, user, userId])

  // Обработка скролла для определения, нужно ли автопрокручивать
  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    lastScrollTopRef.current = scrollTop

    // Если пользователь близко к концу (в пределах 100px), считаем что он внизу
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    hasScrolledToBottomRef.current = isNearBottom
  }

  // Автопрокрутка к последнему сообщению при изменении сообщений
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container || isLoading) return

    // Если нет сообщений или только что загрузили историю, прокручиваем вниз
    if (messages.length > 0 && lastScrollTopRef.current === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
      hasScrolledToBottomRef.current = true
    }
  }, [messages, isLoading])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (wsRef.current && message.trim() !== '' && isConnected) {
      const messageData = {
        username: user?.name || user?.email || 'Anonymous',
        message: message.trim(),
        userId: userId
      }
      console.log('Sending message:', messageData)
      wsRef.current.send(JSON.stringify(messageData))
      setMessage('')

      // После отправки сообщения прокручиваем вниз
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        hasScrolledToBottomRef.current = true
      }, 100)
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Группируем сообщения по датам (уже отсортированы)
  const groupMessagesByDate = () => {
    const groups: { [key: string]: ChatMessage[] } = {}

    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate()

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black'>
      <div className='w-full max-w-4xl h-screen flex flex-col p-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800'>
          <h1 className='text-2xl font-bold text-black dark:text-zinc-50'>Chat Room</h1>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className='flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full'>
              <span className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                {messages.length} messages
              </span>
            </div>
            {user && (
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-sm font-medium'>
                    {(user.name || user.email || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className='text-sm text-gray-600 dark:text-gray-400'>{user.name || user.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Chat Container */}
        <div className='flex-1 flex flex-col bg-white rounded-lg shadow-lg dark:bg-gray-800 overflow-hidden'>
          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className='flex-1 overflow-y-auto p-4 flex flex-col'
          >
            {isLoading ? (
              <div className='flex justify-center items-center h-32'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                <span className='ml-2 text-gray-500'>Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className='flex-1 flex items-center justify-center'>
                <div className='text-center text-gray-500 dark:text-gray-400 py-8'>
                  <div className='text-4xl mb-4'>💬</div>
                  <p className='text-lg'>No messages yet</p>
                  <p className='text-sm'>Start the conversation!</p>
                </div>
              </div>
            ) : (
              <div className='space-y-4'>
                {Object.entries(messageGroups).map(([date, dateMessages]) => (
                  <div key={date}>
                    {/* Date Separator */}
                    <div className='flex justify-center my-6'>
                      <div className='bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full'>
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                          {formatDate(new Date(date).getTime())}
                        </span>
                      </div>
                    </div>

                    {/* Messages for this date */}
                    <div className='space-y-3'>
                      {dateMessages.map((msg, index) => (
                        <div key={msg.id || index} className='flex justify-end'>
                          <div className='max-w-xs lg:max-w-md rounded-2xl px-4 py-2 bg-blue-500 text-white rounded-br-none'>
                            {/* Информация об отправителе */}
                            <div className='flex items-center gap-2 mb-1'>
                              <div className='w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center'>
                                <span className='text-white text-xs font-medium'>
                                  {(msg.username || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className='font-semibold text-sm text-blue-100'>{msg.username}</span>
                            </div>

                            {/* Текст сообщения */}
                            <p className='break-words'>{msg.message}</p>

                            {/* Время */}
                            <div className='text-xs mt-1 text-blue-100'>{formatTime(msg.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className='border-t border-gray-200 dark:border-gray-700 p-4'>
            <form onSubmit={handleSendMessage} className='flex gap-2'>
              <input
                type='text'
                placeholder='Type your message...'
                value={message}
                onChange={e => setMessage(e.target.value)}
                disabled={!isConnected}
                className='flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50'
                maxLength={1000}
              />
              <button
                type='submit'
                disabled={!message.trim() || !isConnected}
                className='px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                  />
                </svg>
              </button>
            </form>
            <div className='text-xs text-gray-500 dark:text-gray-400 mt-2 text-center'>
              {message.length}/1000 characters
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className='mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 text-sm text-center'>
            <div className='flex items-center justify-center gap-2'>
              <div className='animate-pulse w-2 h-2 bg-yellow-600 rounded-full' />
              {connectionError ? connectionError : 'Connecting to chat...'}
            </div>
          </div>
        )}

        {connectionError && (
          <div className='mt-2 p-2 bg-red-100 border border-red-400 rounded text-red-700 text-xs text-center'>
            {connectionError}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
