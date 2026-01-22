import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getQuestionsByTest, getTests, isApiError } from '../api/client'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { QuestionGrid } from '../components/QuestionGrid'
import { QuestionView } from '../components/QuestionView'
import { Timer } from '../components/Timer'
import { useTestSession } from '../context/TestSessionContext'
import type { QuestionItem } from '../models/types'
import { computeResults } from '../utils/computeResults'

const tickInterval = 1000

function getDefaultDuration(nomeProva: string): number {
  const lower = nomeProva.toLowerCase()
  if (lower.includes('dia 1')) return 19800
  if (lower.includes('dia 2')) return 18000
  return 7200
}

export function TestRunnerPage() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useTestSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [finishOpen, setFinishOpen] = useState(false)

  const codigoProva = Number(codigo)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        setLoading(true)
        const [questions, tests] = await Promise.all([
          getQuestionsByTest(codigoProva),
          state.selectedTest ? Promise.resolve([]) : getTests(),
        ])
        if (!isMounted) return
        dispatch({ type: 'SET_QUESTIONS', payload: questions })

        if (!state.selectedTest) {
          const selected = tests.find((item) => item.codigo === codigoProva) || null
          dispatch({ type: 'SET_TEST', payload: selected })
        }

        const testName = state.selectedTest?.nomeProva || tests.find((item) => item.codigo === codigoProva)?.nomeProva
        if (!state.startTime || !state.durationSeconds) {
          const defaultDuration = testName ? getDefaultDuration(testName) : 7200
          dispatch({ type: 'SET_TIMER', payload: { startTime: Date.now(), durationSeconds: defaultDuration } })
        }

        setError(null)
      } catch (err) {
        if (!isMounted) return
        setError(isApiError(err) ? err.message : 'Erro ao carregar questoes')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [codigoProva, dispatch, state.durationSeconds, state.selectedTest, state.startTime])

  useEffect(() => {
    if (!state.startTime || !state.durationSeconds) return

    const startTime = state.startTime
    const durationSeconds = state.durationSeconds

    const updateTime = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = Math.max(durationSeconds - elapsed, 0)
      setRemainingSeconds(remaining)
    }

    updateTime()
    const interval = window.setInterval(updateTime, tickInterval)
    return () => window.clearInterval(interval)
  }, [state.startTime, state.durationSeconds])

  useEffect(() => {
    if (!loading && remainingSeconds === 0 && state.questions.length > 0) {
      handleFinish()
    }
  }, [loading, remainingSeconds, state.questions.length])

  const answeredIds = useMemo(() => new Set(Object.keys(state.answers).map(Number)), [state.answers])

  const currentQuestion: QuestionItem | null = state.questions[currentIndex] ?? null

  const progressValue =
    state.questions.length > 0 ? (answeredIds.size / state.questions.length) * 100 : 0

  const handleAnswer = useCallback(
    (answerCodigo: number) => {
      if (!currentQuestion) return
      dispatch({ type: 'SET_ANSWER', payload: { questionId: currentQuestion.Id, answerCodigo } })
    },
    [currentQuestion, dispatch]
  )

  const handleNavigate = useCallback((nextIndex: number) => {
    setCurrentIndex(nextIndex)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleFinish = () => {
    const elapsedSeconds = state.startTime
      ? Math.max(0, Math.floor((Date.now() - state.startTime) / 1000))
      : 0
    const results = {
      ...computeResults(state.questions, state.answers),
      elapsedSeconds:
        state.durationSeconds !== null
          ? Math.min(elapsedSeconds, state.durationSeconds)
          : elapsedSeconds,
    }
    dispatch({ type: 'SET_RESULTS', payload: results })
    navigate(`/result/${codigoProva}`)
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography>Carregando questoes...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    )
  }

  return (
    <Box sx={{ pb: 6 }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{ borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}
      >
        <Toolbar>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{ width: '100%' }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{state.selectedTest?.nomeProva || 'Prova ENEM'}</Typography>
              <Typography variant="caption" color="text.secondary">
                {answeredIds.size} / {state.questions.length} respondidas
              </Typography>
              <LinearProgress variant="determinate" value={progressValue} sx={{ mt: 1 }} />
            </Box>
            <Timer remainingSeconds={remainingSeconds} />
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {currentQuestion ? (
            <QuestionView
              question={currentQuestion}
              selectedAnswer={state.answers[currentQuestion.Id] ?? null}
              onAnswer={handleAnswer}
            />
          ) : (
            <Typography>Nenhuma questao encontrada.</Typography>
          )}

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', md: 'center' }}
          >
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => handleNavigate(Math.max(currentIndex - 1, 0))}
                disabled={currentIndex === 0}
              >
                Anterior
              </Button>
              <Button
                variant="contained"
                onClick={() => handleNavigate(Math.min(currentIndex + 1, state.questions.length - 1))}
                disabled={currentIndex === state.questions.length - 1}
              >
                Proxima
              </Button>
            </Stack>
            <Button color="error" variant="contained" onClick={() => setFinishOpen(true)}>
              Finalizar prova
            </Button>
          </Stack>

            <QuestionGrid
              total={state.questions.length}
              currentIndex={currentIndex}
              answeredIds={answeredIds}
              questionIds={state.questions.map((question) => question.Id)}
              onSelect={handleNavigate}
            />
        </Stack>
      </Container>

      <ConfirmDialog
        open={finishOpen}
        title="Finalizar prova"
        description="Deseja finalizar agora? O tempo restante nao sera recuperado."
        confirmLabel="Finalizar"
        cancelLabel="Continuar"
        onCancel={() => setFinishOpen(false)}
        onConfirm={handleFinish}
      />
    </Box>
  )
}

