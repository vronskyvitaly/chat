'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

interface ChatMessage {
  id: string
  username: string
  message: string
  senderId: string
  receiverId?: string
  isPrivate: boolean
  timestamp: number
  type: string
  isRead?: boolean
  chatId?: string
}

interface OnlineUser {
  userId: string
  username: string
  email?: string
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}

interface Chat {
  id: string
  type: string
  lastMessage?: string
  updatedAt: string
  members: Array<{
    userId: string
    username: string
    avatar?: string
    isOnline: boolean
  }>
  messages: Array<{
    id: string
    content: string
    sender: {
      id: string
      name: string
    }
  }>
}

interface WebSocketMessageBase {
  type: string
}

interface HistoryMessage extends WebSocketMessageBase {
  type: 'history'
  history?: ChatMessage[]
  chat?: Chat[]
  chatId?: string
  onlineUsers?: OnlineUser[]
}

interface PrivateMessageData extends WebSocketMessageBase {
  type: 'private_message'
  id?: string
  username: string
  message: string
  senderId: string
  receiverId?: string
  chatId?: string
  timestamp?: number
  isRead?: boolean
}

interface UserOnlineMessage extends WebSocketMessageBase {
  type: 'user_online'
  onlineUsers?: OnlineUser[]
}

interface UserOfflineMessage extends WebSocketMessageBase {
  type: 'user_offline'
  onlineUsers?: OnlineUser[]
}

interface UserJoinedMessage extends WebSocketMessageBase {
  type: 'user_joined'
  senderId: string
  username: string
  message?: string
  onlineUsers?: OnlineUser[]
}

interface UserLeftMessage extends WebSocketMessageBase {
  type: 'user_left'
  senderId: string
  username: string
  message?: string
  onlineUsers?: OnlineUser[]
}

interface TypingMessage extends WebSocketMessageBase {
  type: 'typing'
  senderId: string
  username: string
  isTyping: boolean
  receiverId?: string
}

type WebSocketMessage =
  | HistoryMessage
  | PrivateMessageData
  | UserOnlineMessage
  | UserOfflineMessage
  | UserJoinedMessage
  | UserLeftMessage
  | TypingMessage

// Вспомогательная функция для безопасного получения первой буквы имени
const getInitial = (username?: string) => {
  return username?.charAt(0)?.toUpperCase() || 'U'
}

export default function ChatRoom() {
  const { data: session } = useSession()
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [targetUser, setTargetUser] = useState<OnlineUser | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentChatIdRef = useRef<string | null>(null)
  const connectionAttemptRef = useRef(0)
  const processedMessageIds = useRef<Set<string>>(new Set())

  // Обработчик входящих сообщений
  const handleIncomingMessage = (data: WebSocketMessage) => {
    console.log('Received message:', data)

    switch (data.type) {
      case 'history':
        if (data.history) {
          // Очищаем отслеживаемые ID при загрузке новой истории
          processedMessageIds.current.clear()
          const newMessages = data.history || []
          // Добавляем ID всех сообщений из истории в отслеживаемые
          newMessages.forEach(msg => {
            if (msg.id) processedMessageIds.current.add(msg.id)
          })
          setMessages(newMessages)
        }
        if (data.chatId) {
          currentChatIdRef.current = data.chatId
        }
        // Получаем актуальный список пользователей из истории
        if (data.onlineUsers) {
          setOnlineUsers(data.onlineUsers)
        }
        break

      case 'private_message':
        if (
          data.chatId === currentChatIdRef.current ||
          data.receiverId === session?.user?.id ||
          data.senderId === session?.user?.id
        ) {
          // Проверяем, не обрабатывали ли мы уже это сообщение
          if (data.id && processedMessageIds.current.has(data.id)) {
            console.log('🟡 Duplicate message detected, skipping:', data.id)
            return
          }

          // Добавляем ID в обработанные
          if (data.id) {
            processedMessageIds.current.add(data.id)
          }

          setMessages(prev => [
            ...prev,
            {
              id: data.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              username: data.username,
              message: data.message,
              senderId: data.senderId,
              receiverId: data.receiverId,
              isPrivate: true,
              timestamp: data.timestamp || Date.now(),
              type: 'private_message',
              isRead: data.isRead,
              chatId: data.chatId
            }
          ])
        }
        break

      case 'user_online':
        if (data.onlineUsers) {
          console.log('Setting online users from user_online:', data.onlineUsers)
          setOnlineUsers(data.onlineUsers)
        }
        break

      case 'user_offline':
        if (data.onlineUsers) {
          console.log('Setting online users from user_offline:', data.onlineUsers)
          setOnlineUsers(data.onlineUsers)
        }
        break

      case 'user_joined':
        // Обновляем список пользователей из сообщения, если он есть
        if (data.onlineUsers) {
          console.log('Setting online users from user_joined:', data.onlineUsers)
          setOnlineUsers(data.onlineUsers)
        } else {
          // Или добавляем пользователя вручную
          setOnlineUsers(prev => {
            const userExists = prev.some(user => user.userId === data.senderId)
            if (!userExists) {
              return [
                ...prev,
                {
                  userId: data.senderId,
                  username: data.username,
                  email: '',
                  isOnline: true,
                  lastSeen: new Date().toISOString()
                }
              ]
            }
            return prev.map(user => (user.userId === data.senderId ? { ...user, isOnline: true } : user))
          })
        }

        // Показываем системное сообщение только для других пользователей
        if (data.senderId !== session?.user?.id) {
          setMessages(prev => [
            ...prev,
            {
              id: `system-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              isPrivate: false,
              username: 'System',
              message: data.message || `${data.username} в сети`,
              senderId: 'system',
              timestamp: Date.now(),
              type: 'system'
            }
          ])
        }
        break

      case 'user_left':
        // Обновляем список пользователей из сообщения, если он есть
        if (data.onlineUsers) {
          console.log('Setting online users from user_left:', data.onlineUsers)
          setOnlineUsers(data.onlineUsers)
        } else {
          // Или обновляем статус пользователя вручную
          setOnlineUsers(prev =>
            prev.map(user => (user.userId === data.senderId ? { ...user, isOnline: false } : user))
          )
        }

        // Показываем системное сообщение только для других пользователей
        if (data.senderId !== session?.user?.id) {
          setMessages(prev => [
            ...prev,
            {
              id: `system-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              isPrivate: false,
              username: 'System',
              message: data.message || `${data.username} вышел из сети`,
              senderId: 'system',
              timestamp: Date.now(),
              type: 'system'
            }
          ])
        }
        break

      case 'typing':
        if (data.receiverId === session?.user?.id) {
          if (data.isTyping) {
            setTypingUsers(prev => [...new Set([...prev, data.username])])
          } else {
            setTypingUsers(prev => prev.filter(user => user !== data.username))
          }
        }
        break

      default:
        console.log('Unknown message type:', data)
    }
  }

  // Упрощенная функция генерации ключей
  const generateMessageKey = (message: ChatMessage, index: number) => {
    return `${message.id}-${index}-${message.timestamp}`
  }

  // Подключение к WebSocket
  useEffect(() => {
    if (!session?.user?.id || !session.user.name) return

    const websocket = new WebSocket(
      `${process.env.NEXT_PUBLIC_EXPRESS_URL_WS}chatroom?username=${encodeURIComponent(session.user.name)}&userId=${session.user.id}`
    )

    websocket.onopen = () => {
      console.log('Connected to chat')
      setWs(websocket)
      connectionAttemptRef.current = 0

      // Запрашиваем историю и текущее состояние
      const historyMessage = {
        type: 'get_history',
        userId: session.user.id
      }
      websocket.send(JSON.stringify(historyMessage))
    }

    websocket.onmessage = event => {
      try {
        const data = JSON.parse(event.data)
        console.log('🔵 WebSocket message received:', data.type, data.id || 'no-id')
        handleIncomingMessage(data)
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    websocket.onclose = () => {
      console.log('Disconnected from chat')
      setWs(null)

      // Пытаемся переподключиться
      if (connectionAttemptRef.current < 3) {
        connectionAttemptRef.current++
        setTimeout(() => {
          if (session?.user?.id && session.user.name) {
            console.log('Attempting to reconnect...')
            setWs(null)
          }
        }, 2000 * connectionAttemptRef.current)
      }
    }

    websocket.onerror = error => {
      console.error('WebSocket error:', error)
    }

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close()
      }
    }
  }, [session?.user?.id, session?.user?.name])

  // Начать чат с пользователем
  const startChatWithUser = (user: OnlineUser) => {
    if (!ws) return

    setTargetUser(user)
    setMessages([])
    processedMessageIds.current.clear() // Очищаем отслеживаемые ID при смене чата
    currentChatIdRef.current = null

    const joinMessage = {
      type: 'join_chat',
      username: session?.user?.name,
      targetUserId: user.userId,
      message: ''
    }

    console.log('Starting chat with user:', user.userId)
    ws.send(JSON.stringify(joinMessage))
  }

  // Закрыть текущий чат
  const closeCurrentChat = () => {
    setTargetUser(null)
    setMessages([])
    setTypingUsers([])
    processedMessageIds.current.clear() // Очищаем отслеживаемые ID при закрытии чата
    currentChatIdRef.current = null
  }

  const sendMessage = () => {
    if (!message.trim() || !ws || !targetUser) return

    const messageData = {
      type: 'private_message',
      username: session?.user?.name,
      message: message.trim(),
      receiverId: targetUser.userId
    }

    console.log('🟡 SENDING message to:', targetUser.userId)
    ws.send(JSON.stringify(messageData))
    setMessage('')
  }

  const handleTyping = (typing: boolean) => {
    if (!ws || !targetUser) return

    const typingData = {
      type: 'typing',
      username: session?.user?.name,
      message: typing ? 'start' : 'stop',
      receiverId: targetUser.userId
    }

    ws.send(JSON.stringify(typingData))
    setIsTyping(typing)
  }

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Очистка индикатора набора при смене чата
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTypingUsers([])
  }, [targetUser])

  // Отладочный вывод текущих сообщений
  useEffect(() => {
    console.log('📝 Current messages count:', messages.length)
    console.log('📝 Tracked message IDs:', Array.from(processedMessageIds.current))
  }, [messages])

  // Вспомогательные функции
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatLastSeen = (lastSeen: string) => {
    const now = new Date()
    const lastSeenDate = new Date(lastSeen)
    const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'только что'
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`
    return `${Math.floor(diffInMinutes / 1440)} дн назад`
  }

  // Получаем всех пользователей (исключая текущего) и фильтруем по поиску
  const allUsers = onlineUsers.filter(user => {
    return (
      +user.userId !== session?.user?.id && user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Сортируем пользователей: сначала онлайн, потом оффлайн
  const sortedUsers = [...allUsers]
    .filter(u => u.userId !== session?.user?.id)
    .sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1
      if (!a.isOnline && b.isOnline) return 1
      return a.username.localeCompare(b.username)
    })

  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      {/* Список чатов и пользователей */}
      <div className='w-80 bg-gray-800 border-r border-gray-700 flex flex-col'>
        {/* Заголовок */}
        <div className='p-4 border-b border-gray-700'>
          <h1 className='text-xl font-bold text-white'>Сообщения</h1>
          <p className='text-sm text-gray-400 mt-1'>
            {onlineUsers.filter(user => user.userId !== session?.user?.id && user.isOnline).length} онлайн
          </p>
        </div>

        {/* Поиск пользователей */}
        <div className='p-4 border-b border-gray-700'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Поиск пользователей...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <svg
              className='absolute left-3 top-2.5 w-4 h-4 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
        </div>

        {/* Объединенный список всех пользователей */}
        <div className='flex-1 overflow-y-auto'>
          <div className='p-4'>
            <div className='space-y-2'>
              {sortedUsers.length === 0 ? (
                <p className='text-sm text-gray-400 text-center py-4'>
                  {searchQuery ? 'Пользователи не найдены' : 'Нет других пользователей'}
                </p>
              ) : (
                sortedUsers.map(user => (
                  <div
                    key={user.userId}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      targetUser?.userId === user.userId ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => startChatWithUser(user)}
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='relative'>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            user.isOnline
                              ? 'bg-gradient-to-br from-green-500 to-blue-600'
                              : 'bg-gradient-to-br from-gray-500 to-gray-600'
                          }`}
                        >
                          {getInitial(user.username)}
                        </div>
                        {user.isOnline && (
                          <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full'></div>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium text-white'>{user.username}</span>
                        <span className='text-xs text-gray-400'>
                          {user.isOnline
                            ? 'В сети'
                            : user.lastSeen
                              ? formatLastSeen(user.lastSeen)
                              : 'offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Область чата */}
      <div className='flex-1 flex flex-col'>
        {targetUser ? (
          <>
            {/* Заголовок чата */}
            <div className='bg-gray-800 border-b border-gray-700 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='relative'>
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                      {getInitial(targetUser.username)}
                    </div>
                    {targetUser.isOnline && (
                      <div className='absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-gray-800 rounded-full'></div>
                    )}
                  </div>
                  <div>
                    <h2 className='font-semibold text-white'>{targetUser.username}</h2>
                    <p className='text-sm text-gray-400'>
                      {targetUser.isOnline ? 'В сети' : 'Был(а) недавно'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCurrentChat}
                  className='p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>

              {/* Индикатор набора текста */}
              {typingUsers.length > 0 && (
                <div className='mt-2 flex items-center space-x-2 text-sm text-blue-400'>
                  <div className='flex space-x-1'>
                    <div className='w-1 h-1 bg-blue-400 rounded-full animate-bounce'></div>
                    <div
                      className='w-1 h-1 bg-blue-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className='w-1 h-1 bg-blue-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                  <span>{typingUsers.join(', ')} печатает...</span>
                </div>
              )}
            </div>

            {/* Область сообщений */}
            <div className='flex-1 overflow-y-auto bg-gray-900 p-4 space-y-4'>
              {messages.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                  <div className='text-6xl mb-4'>👋</div>
                  <p className='text-lg text-gray-400 mb-2'>Нет сообщений</p>
                  <p className='text-sm text-gray-500'>Начните общение с {targetUser.username}</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMyMessage = msg.senderId === session?.user?.id
                  const isSystemMessage = msg.type === 'system'

                  return (
                    <div
                      key={generateMessageKey(msg, index)}
                      className={`flex ${isMyMessage ? 'justify-end' : isSystemMessage ? 'justify-center' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2 rounded-2xl ${
                          isMyMessage
                            ? 'bg-blue-600 text-white rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl'
                            : isSystemMessage
                              ? 'bg-gray-700 text-gray-300 text-sm rounded-2xl'
                              : 'bg-gray-700 text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
                        }`}
                      >
                        {!isSystemMessage && !isMyMessage && (
                          <div className='font-semibold text-sm mb-1 text-blue-400'>{msg.username}</div>
                        )}
                        <div className='text-sm'>{msg.message}</div>
                        <div
                          className={`text-xs mt-1 flex items-center ${
                            isMyMessage ? 'justify-end' : 'justify-start'
                          } space-x-1 ${isMyMessage ? 'text-blue-200' : 'text-gray-400'}`}
                        >
                          <span>{formatTime(msg.timestamp)}</span>
                          {isMyMessage && <span>{msg.isRead ? '✓✓' : '✓'}</span>}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Панель ввода сообщения */}
            <div className='bg-gray-800 border-t border-gray-700 p-4'>
              <div className='flex space-x-3'>
                <input
                  type='text'
                  value={message}
                  onChange={e => {
                    setMessage(e.target.value)
                    if (!isTyping && e.target.value.trim()) {
                      handleTyping(true)
                    } else if (e.target.value.trim() === '') {
                      handleTyping(false)
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                      handleTyping(false)
                    }
                  }}
                  onBlur={() => handleTyping(false)}
                  placeholder={`Сообщение для ${targetUser.username}...`}
                  className='flex-1 px-4 py-3 border border-gray-600 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                  disabled={!ws}
                />
                <button
                  onClick={() => {
                    sendMessage()
                    handleTyping(false)
                  }}
                  disabled={!message.trim() || !ws}
                  className='px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
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
              </div>
            </div>
          </>
        ) : (
          <div className='flex-1 flex flex-col items-center justify-center bg-gray-900'>
            <div className='text-center'>
              <div className='text-6xl mb-4'>💬</div>
              <h2 className='text-2xl font-bold text-white mb-2'>Выберите чат</h2>
              <p className='text-gray-400'>Начните общение с кем-нибудь из списка</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
