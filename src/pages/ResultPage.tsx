import { useMemo } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { ResultCharts } from '../components/ResultCharts'
import { ReviewItem } from '../components/ReviewItem'
import { useTestSession } from '../context/TestSessionContext'
import { computeResults } from '../utils/computeResults'
import { formatTime } from '../utils/formatTime'

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

  const handleRetake = () => {
    const selectedTest = state.selectedTest
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

