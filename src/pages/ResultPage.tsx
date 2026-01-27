import { useEffect, useMemo } from 'react'
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { ResultCharts } from '../components/ResultCharts'
import { ReviewItem } from '../components/ReviewItem'
import { useTestSession } from '../context/TestSessionContext'
import { computeResults } from '../utils/computeResults'
import { formatTime } from '../utils/formatTime'
import { addAttempt, getHistory, type ExamType, type StoredAttempt } from '../storage/historyStorage'

function getDefaultDuration(nomeProva: string): number {
  const lower = nomeProva.toLowerCase()
  if (lower.includes('dia 1')) return 19800
  if (lower.includes('dia 2')) return 18000
  return 7200
}

export function ResultPage() {
  const navigate = useNavigate()
  const { codigo } = useParams()
  const { state, dispatch } = useTestSession()
  const MIN_QUESTIONS_FOR_RANKING = 3
  const MIN_SUBJECTS_FOR_RANKING = 2

  const results = useMemo(() => {
    if (state.results) return state.results
    if (state.questions.length === 0) return null
    return computeResults(state.questions, state.answers)
  }, [state.answers, state.questions, state.results])

  const elapsedSeconds = useMemo(() => {
    if (!results) return 0
    if (results.elapsedSeconds !== undefined) return results.elapsedSeconds
    if (!state.startTime) return 0
    const elapsed = Math.max(0, Math.floor((Date.now() - state.startTime) / 1000))
    return state.durationSeconds ? Math.min(elapsed, state.durationSeconds) : elapsed
  }, [results, state.durationSeconds, state.startTime])

  if (!results) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography>Nenhum resultado disponivel. Volte para a pagina inicial.</Typography>
      </Container>
    )
  }

  const resolveExamType = (testName?: string, banca?: string): ExamType => {
    const name = testName?.toLowerCase() ?? ''
    const bank = banca?.toLowerCase() ?? ''
    if (name.includes('enem') || bank.includes('inep')) return 'ENEM'
    if (name.includes('iftm') || bank.includes('iftm')) return 'IFTM'
    if (name.includes('ufu') || bank.includes('ufu')) return 'UFU'
    return 'UNKNOWN'
  }

  const subjectStats = useMemo(() => {
    const stats = results.perMateria.map((item) => {
      const rawLabel = item.materia?.trim() || 'Sem categoria'
      const label = rawLabel.toLowerCase() === 'sem materia' ? 'Sem categoria' : rawLabel
      const accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 1000) / 10 : 0
      return {
        subject: label,
        total: item.total,
        correct: item.correct,
        wrong: item.wrong,
        blank: item.blank,
        accuracy,
      }
    })

    return stats.sort((a, b) => {
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy
      return b.total - a.total
    })
  }, [results.perMateria])

  const rankedSubjects = useMemo(
    () => subjectStats.filter((item) => item.total >= MIN_QUESTIONS_FOR_RANKING),
    [subjectStats]
  )
  const hasRankingData = rankedSubjects.length >= MIN_SUBJECTS_FOR_RANKING

  const bestSubjects = useMemo(
    () =>
      [...rankedSubjects]
        .sort((a, b) => {
          if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy
          return b.total - a.total
        })
        .slice(0, 3),
    [rankedSubjects]
  )

  const improvementSubjects = useMemo(
    () =>
      [...rankedSubjects]
        .sort((a, b) => {
          if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy
          return b.total - a.total
        })
        .slice(0, 3),
    [rankedSubjects]
  )

  useEffect(() => {
    try {
      const attemptId = sessionStorage.getItem('enemsprint.currentAttemptId')
      if (!attemptId) return
      const existing = getHistory().some((item) => item.attemptId === attemptId)
      if (existing) return

      const testName = state.selectedTest?.nomeProva ?? ''
      const examType = resolveExamType(testName, state.selectedTest?.banca)
      const total = results.correctCount + results.wrongCount + results.blankCount
      const scorePercent = total > 0 ? Math.round((results.correctCount / total) * 1000) / 10 : 0

      const attempt: StoredAttempt = {
        attemptId,
        testCode: String(codigo ?? ''),
        testName,
        examType,
        createdAt: new Date().toISOString(),
        durationSeconds: state.durationSeconds ?? 0,
        totals: {
          total,
          correct: results.correctCount,
          wrong: results.wrongCount,
          blank: results.blankCount,
          scorePercent,
        },
        subjectStats,
      }

      addAttempt(attempt)
      sessionStorage.removeItem('enemsprint.currentAttemptId')
    } catch {
      // ignore persistence errors
    }
  }, [codigo, results, state.durationSeconds, state.selectedTest, subjectStats])

  const handleRetake = () => {
    const selectedTest = state.selectedTest
    const attemptId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    try {
      sessionStorage.setItem('enemsprint.currentAttemptId', attemptId)
    } catch {
      // ignore session storage errors
    }
    dispatch({ type: 'RESET_SESSION' })
    if (selectedTest) {
      dispatch({ type: 'SET_TEST', payload: selectedTest })
      dispatch({
        type: 'SET_TIMER',
        payload: { startTime: Date.now(), durationSeconds: getDefaultDuration(selectedTest.nomeProva) },
      })
    }
    navigate(`/test/${codigo}`)
  }

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h4">Resultados</Typography>
            <Typography variant="body1" color="text.secondary">
              Confira seu desempenho e revise as questoes.
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box sx={{ flex: 1, p: 3, borderRadius: 3, backgroundColor: 'background.paper', boxShadow: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Pontuacao geral
              </Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>
                {results.percentage}%
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Typography variant="body2">Acertos: {results.correctCount}</Typography>
                <Typography variant="body2">Erros: {results.wrongCount}</Typography>
                <Typography variant="body2">Brancas: {results.blankCount}</Typography>
                <Typography variant="body2">Tempo: {formatTime(elapsedSeconds)}</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: 1 }}>
              <ResultCharts results={results} />
            </Box>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h5">Performance por matéria</Typography>
            <Paper variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Matéria</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Acertos</TableCell>
                    <TableCell align="right">Erros</TableCell>
                    <TableCell align="right">Em branco</TableCell>
                    <TableCell align="right">% de acerto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjectStats.map((item) => (
                    <TableRow key={item.subject}>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell align="right">{item.total}</TableCell>
                      <TableCell align="right">{item.correct}</TableCell>
                      <TableCell align="right">{item.wrong}</TableCell>
                      <TableCell align="right">{item.blank}</TableCell>
                      <TableCell align="right">{item.accuracy.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Pontos fortes
                </Typography>
                {hasRankingData ? (
                  <Stack spacing={1}>
                    {bestSubjects.map((item) => (
                      <Typography key={item.subject} variant="body2" color="text.secondary">
                        {item.subject} — {Math.round(item.accuracy)}% ({item.correct}/{item.total})
                      </Typography>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Ainda não há dados suficientes para ranking por matéria.
                  </Typography>
                )}
              </Paper>
              <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Pontos a melhorar
                </Typography>
                {hasRankingData ? (
                  <Stack spacing={1}>
                    {improvementSubjects.map((item) => (
                      <Typography key={item.subject} variant="body2" color="text.secondary">
                        {item.subject} — {Math.round(item.accuracy)}% ({item.correct}/{item.total})
                      </Typography>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Ainda não há dados suficientes para ranking por matéria.
                  </Typography>
                )}
              </Paper>
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h6">Revisao das questoes</Typography>
            {results.perQuestion.map((item) => (
              <ReviewItem key={item.questionId} item={item} />
            ))}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" onClick={handleRetake}>
              Refazer prova
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')}>Voltar ao inicio</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

