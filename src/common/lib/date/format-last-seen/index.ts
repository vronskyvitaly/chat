'use client'

/**
 * Форматирует время последнего визита пользователя в читаемый формат
 * @param lastSeen - ISO строка даты последнего визита
 * @returns Отформатированная строка (например, "5 мин назад", "2 ч назад", "3 дн назад")
 */
export const formatLastSeen = (lastSeen: string): string => {
  const now = new Date()
  const lastSeenDate = new Date(lastSeen)
  const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'только что'
  if (diffInMinutes < 60) return `${diffInMinutes} мин назад`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`
  return `${Math.floor(diffInMinutes / 1440)} дн назад`
}
