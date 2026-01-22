import React, { createContext, useContext, useMemo, useReducer } from 'react'
import type { QuestionItem, TestItem, TestResults } from '../models/types'

export type TestSessionState = {
  selectedTest: TestItem | null
  questions: QuestionItem[]
  answers: Record<number, number>
  startTime: number | null
  durationSeconds: number | null
  results: TestResults | null
}

type TestSessionAction =
  | { type: 'SET_TEST'; payload: TestItem | null }
  | { type: 'SET_QUESTIONS'; payload: QuestionItem[] }
  | { type: 'SET_ANSWER'; payload: { questionId: number; answerCodigo: number } }
  | { type: 'SET_TIMER'; payload: { startTime: number; durationSeconds: number } }
  | { type: 'SET_RESULTS'; payload: TestResults | null }
  | { type: 'RESET_SESSION' }

const initialState: TestSessionState = {
  selectedTest: null,
  questions: [],
  answers: {},
  startTime: null,
  durationSeconds: null,
  results: null,
}

function reducer(state: TestSessionState, action: TestSessionAction): TestSessionState {
  switch (action.type) {
    case 'SET_TEST':
      return { ...state, selectedTest: action.payload }
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload }
    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.payload.questionId]: action.payload.answerCodigo },
      }
    case 'SET_TIMER':
      return {
        ...state,
        startTime: action.payload.startTime,
        durationSeconds: action.payload.durationSeconds,
      }
    case 'SET_RESULTS':
      return { ...state, results: action.payload }
    case 'RESET_SESSION':
      return { ...initialState }
    default:
      return state
  }
}

type TestSessionContextValue = {
  state: TestSessionState
  dispatch: React.Dispatch<TestSessionAction>
}

const TestSessionContext = createContext<TestSessionContextValue | undefined>(undefined)

export function TestSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])

  return <TestSessionContext.Provider value={value}>{children}</TestSessionContext.Provider>
}

export function useTestSession() {
  const context = useContext(TestSessionContext)
  if (!context) {
    throw new Error('useTestSession must be used within TestSessionProvider')
  }
  return context
}

