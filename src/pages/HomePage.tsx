import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getTests, isApiError } from '../api/client'
import type { TestItem } from '../models/types'
import { TestCard } from '../components/TestCard'
import { useTestSession } from '../context/TestSessionContext'
import { getHistory, type StoredAttempt } from '../storage/historyStorage'

const durationOptions = [
  { label: '30m', value: 1800 },
  { label: '1h', value: 3600 },
  { label: '2h', value: 7200 },
  { label: '5h', value: 18000 },
  { label: '5h30', value: 19800 },
]

type ExamFilter = 'ENEM' | 'IFTM' | 'UFU'

function getDefaultDuration(nomeProva: string): number {
  const lower = nomeProva.toLowerCase()
  if (lower.includes('dia 1')) return 19800
  if (lower.includes('dia 2')) return 18000
  return 7200
}

function matchesEnem(test: TestItem): boolean {
  const nome = test.nomeProva?.toLowerCase() ?? ''
  const banca = test.banca?.toLowerCase() ?? ''
  return nome.includes('enem') || banca.includes('inep')
}

function matchesIftm(test: TestItem): boolean {
  const nome = test.nomeProva?.toLowerCase() ?? ''
  const banca = test.banca?.toLowerCase() ?? ''
  return nome.includes('iftm') || banca.includes('iftm')
}

function matchesUfu(test: TestItem): boolean {
  const nome = test.nomeProva?.toLowerCase() ?? ''
  const banca = test.banca?.toLowerCase() ?? ''
  return nome.includes('ufu') || banca.includes('ufu')
}

function getYearString(dateValue?: string): string {
  if (!dateValue) return ''
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return ''
  return String(parsed.getFullYear())
}

export function HomePage() {
  const navigate = useNavigate()
  const { dispatch } = useTestSession()
  const [tests, setTests] = useState<TestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [examFilter, setExamFilter] = useState<ExamFilter>('ENEM')
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [historyMap, setHistoryMap] = useState<Map<string, StoredAttempt>>(new Map())

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        setLoading(true)
        const data = await getTests()
        if (!isMounted) return
        setTests(data)
        setError(null)
      } catch (err) {
        if (!isMounted) return
        setError(isApiError(err) ? err.message : 'Erro ao carregar provas')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const attempts = getHistory()
    const map = new Map<string, StoredAttempt>()
    attempts.forEach((attempt) => {
      if (!map.has(attempt.testCode)) {
        map.set(attempt.testCode, attempt)
      }
    })
    setHistoryMap(map)
  }, [])

  const filteredTests = useMemo(() => {
    const term = search.trim().toLowerCase()
    const baseFiltered = tests.filter((test) => {
      if (examFilter === 'IFTM') return matchesIftm(test)
      if (examFilter === 'UFU') return matchesUfu(test)
      return matchesEnem(test)
    })
    if (!term) return baseFiltered
    return baseFiltered.filter((test) => {
      const nome = test.nomeProva.toLowerCase()
      const tipo = test.tipoProva?.toLowerCase() ?? ''
      const year = getYearString(test.dataAplicacao)
      const banca = test.banca?.toLowerCase() ?? ''
      return nome.includes(term) || tipo.includes(term) || year.includes(term) || banca.includes(term)
    })
  }, [tests, search, examFilter])

  const handleStart = (test: TestItem) => {
    const defaultDuration = getDefaultDuration(test.nomeProva)
    setSelectedTest(test)
    setSelectedDuration(defaultDuration)
  }

  const handleConfirmStart = () => {
    if (!selectedTest || !selectedDuration) return
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
    dispatch({ type: 'SET_TEST', payload: selectedTest })
    dispatch({
      type: 'SET_TIMER',
      payload: { startTime: Date.now(), durationSeconds: selectedDuration },
    })
    navigate(`/test/${selectedTest.codigo}`)
  }

  const handleCloseDialog = () => {
    setSelectedTest(null)
    setSelectedDuration(null)
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Typography variant="h4">Praticar</Typography>
              <ButtonGroup variant="outlined" size="small">
                <Button
                  variant={examFilter === 'ENEM' ? 'contained' : 'outlined'}
                  onClick={() => setExamFilter('ENEM')}
                >
                  ENEM
                </Button>
                <Button
                  variant={examFilter === 'IFTM' ? 'contained' : 'outlined'}
                  onClick={() => setExamFilter('IFTM')}
                >
                  IFTM
                </Button>
                <Button
                  variant={examFilter === 'UFU' ? 'contained' : 'outlined'}
                  onClick={() => setExamFilter('UFU')}
                >
                  UFU
                </Button>
              </ButtonGroup>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Escolha a prova, ajuste o tempo e simule o dia da prova.
            </Typography>
          </Stack>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Simulados do ENEM, IFTM e UFU
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Correção automática, análise por matéria e histórico no seu dispositivo. Treine gestão de tempo e acompanhe sua evolução — sem login e sem anúncios.
            </Typography>
          </Paper>
          <TextField
            label="Buscar por ano, dia ou cor"
            placeholder="Ex: 2022, Dia 1, Azul"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            fullWidth
          />
          <Box id="tests">
            {loading ? (
              <Typography>Carregando provas...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 2,
                }}
              >
              {filteredTests.map((test) => (
                <TestCard
                  key={test.codigo}
                  test={test}
                  onStart={handleStart}
                  lastAttempt={historyMap.get(String(test.codigo))}
                />
              ))}
            </Box>
          )}
          </Box>
        </Stack>
      </Container>

      <Dialog open={Boolean(selectedTest)} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Definir duracao</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Ajuste o tempo antes de iniciar a prova.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {durationOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedDuration === option.value ? 'contained' : 'outlined'}
                  onClick={() => setSelectedDuration(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmStart}>
            Iniciar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

