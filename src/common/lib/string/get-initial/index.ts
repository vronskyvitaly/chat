'use client'

/**
 * Получает первую букву имени пользователя в верхнем регистре
 * @param username - Имя пользователя (опционально)
 * @returns Первая буква имени или 'U' по умолчанию
 */
export const getInitial = (username?: string): string => {
  return username?.charAt(0)?.toUpperCase() || 'U'
}
