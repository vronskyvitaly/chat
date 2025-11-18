'use client'

/**
 * Генерирует уникальный ключ для сообщения
 * @param message - Объект сообщения с id и timestamp
 * @param index - Индекс сообщения в списке
 * @returns Уникальный ключ для React key prop
 */
export const generateMessageKey = (message: { id: string; timestamp: number }, index: number): string => {
  return `${message.id}-${index}-${message.timestamp}`
}
