export type ExamType = 'ENEM' | 'IFTM' | 'UFU' | 'UNKNOWN'

export type StoredAttempt = {
  attemptId: string
  testCode: string
  testName: string
  examType: ExamType
  createdAt: string
  durationSeconds: number
  totals: {
    total: number
    correct: number
    wrong: number
    blank: number
    scorePercent: number
  }
  subjectStats?: Array<{
    subject: string
    total: number
    correct: number
    wrong: number
    blank: number
    accuracy: number
  }>
}

const STORAGE_KEY = 'enemsprint.history.v1'

function safeParse(value: string | null): StoredAttempt[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidAttempt)
  } catch {
    return []
  }
}

function isValidAttempt(value: unknown): value is StoredAttempt {
  if (!value || typeof value !== 'object') return false
  const attempt = value as StoredAttempt
  return (
    typeof attempt.attemptId === 'string' &&
    typeof attempt.testCode === 'string' &&
    typeof attempt.testName === 'string' &&
    typeof attempt.examType === 'string' &&
    typeof attempt.createdAt === 'string' &&
    typeof attempt.durationSeconds === 'number' &&
    typeof attempt.totals?.total === 'number' &&
    typeof attempt.totals?.correct === 'number' &&
    typeof attempt.totals?.wrong === 'number' &&
    typeof attempt.totals?.blank === 'number' &&
    typeof attempt.totals?.scorePercent === 'number'
  )
}

function writeHistory(items: StoredAttempt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore storage errors
  }
}

export function getHistory(): StoredAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const items = safeParse(raw)
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch {
    return []
  }
}

export function addAttempt(attempt: StoredAttempt): void {
  const items = getHistory()
  if (items.some((item) => item.attemptId === attempt.attemptId)) return
  const next = [attempt, ...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  writeHistory(next)
}

export function deleteAttempt(attemptId: string): void {
  const items = getHistory()
  const next = items.filter((item) => item.attemptId !== attemptId)
  writeHistory(next)
}

export function clearHistory(): void {
  writeHistory([])
}

export function getLastAttemptByTestCode(testCode: string): StoredAttempt | undefined {
  return getHistory().find((item) => item.testCode === testCode)
}

export function getBestAttemptByTestCode(testCode: string): StoredAttempt | undefined {
  const attempts = getHistory().filter((item) => item.testCode === testCode)
  if (attempts.length === 0) return undefined
  return attempts.reduce((best, current) => {
    if (current.totals.scorePercent > best.totals.scorePercent) return current
    if (current.totals.scorePercent < best.totals.scorePercent) return best
    return current.createdAt > best.createdAt ? current : best
  }, attempts[0])
}

