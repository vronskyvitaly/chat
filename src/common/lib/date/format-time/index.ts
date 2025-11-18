'use client'

/**
 * Форматирует timestamp в строку с различными вариантами отображения
 * @param timestamp - Unix timestamp в миллисекундах
 * @param format - Формат вывода
 * @returns Отформатированная строка
 */
export const formatTime = (
  timestamp: number,
  format: 'time' | 'date' | 'datetime' | 'full' = 'time'
): string => {
  const date = new Date(timestamp)

  const formats = {
    time: {
      hour: '2-digit',
      minute: '2-digit'
    } as Intl.DateTimeFormatOptions,

    date: {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    } as Intl.DateTimeFormatOptions,

    datetime: {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    } as Intl.DateTimeFormatOptions,

    full: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    } as Intl.DateTimeFormatOptions
  }

  return date.toLocaleString('ru-RU', formats[format])
}
