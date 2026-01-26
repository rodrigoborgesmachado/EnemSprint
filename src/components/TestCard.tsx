import { Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { TestItem } from '../models/types'
import type { StoredAttempt } from '../storage/historyStorage'

export type TestCardProps = {
  test: TestItem
  onStart: (test: TestItem) => void
  lastAttempt?: StoredAttempt
}

function getYear(dateValue?: string): string {
  if (!dateValue) return 'Ano indefinido'
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return 'Ano indefinido'
  return String(parsed.getFullYear())
}

export function TestCard({ test, onStart, lastAttempt }: TestCardProps) {
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">{test.nomeProva}</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip size="small" label={getYear(test.dataAplicacao)} />
            {test.tipoProva ? <Chip size="small" label={test.tipoProva} /> : null}
          </Stack>
          {lastAttempt ? (
            <Typography variant="caption" color="text.secondary">
              Última nota: {lastAttempt.totals.scorePercent.toFixed(1)}%
            </Typography>
          ) : null}
          <Typography variant="body2" color="text.secondary">
            {test.banca || 'Banca não informada'}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button variant="contained" onClick={() => onStart(test)}>
          Start
        </Button>
      </CardActions>
    </Card>
  )
}

