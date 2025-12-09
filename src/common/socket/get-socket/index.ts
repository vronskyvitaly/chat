import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = <T extends Record<string, unknown>>(query: T): Socket => {
  if (!socket) {
    // todo: ЗАМЕНИТЬ ПРИ ДЕПЛОЕ НА КЛИЕНТЕ НА https://server.developerserver.ru/
    socket = io(process.env.NEXT_PUBLIC_EXPRESS_URL_WS + 'WS', {
      transports: ['websocket'],
      query
    })

    socket.on('connect', () => console.log('✅ Connected to server'))
    socket.on('disconnect', () => console.log('❌ Disconnected from server'))
  }
  return socket
}
