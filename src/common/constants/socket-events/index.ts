
export const SOCKET_EVENT_USERS = {
  USER_ONLINE: 'USER_ONLINE',
  USER_OFFLINE: 'USER_OFFLINE'
} as const


export const SOCKET_EVENT_AUTH = {

} as const


export const SOCKET_EVENT_POSTS = {
  POST_CREATED: 'POST_CREATED',
  POST_DELETED: 'POST_DELETED'
} as const


export type SOCKET_EVENTS = keyof typeof SOCKET_EVENT_POSTS | keyof typeof SOCKET_EVENT_USERS | keyof typeof SOCKET_EVENT_AUTH
