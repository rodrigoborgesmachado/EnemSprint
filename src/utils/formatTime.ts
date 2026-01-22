export function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60

  const padded = (value: number) => String(value).padStart(2, '0')
  return `${padded(hours)}:${padded(minutes)}:${padded(seconds)}`
}

