export function saveLocal<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getLocal<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
