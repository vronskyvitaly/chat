import type { Socket } from 'socket.io-client'
import { getSocket } from '@/common/socket/get-socket'
import { SOCKET_EVENTS } from '@/common/constants/socket-events'

type Callback<T> = (data: T) => void

export const subscribeToEvent = <T, Q extends Record<string, unknown>>(
  event: SOCKET_EVENTS,
  callback: Callback<T>,
  query: Q
) => {
  const socket: Socket = getSocket(query)
  socket.on(event, callback)

  return () => {
    socket.off(event, callback)
  }
}
