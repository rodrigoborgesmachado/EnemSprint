import { Chip, Stack, Typography } from '@mui/material'
import { formatTime } from '../utils/formatTime'

export type TimerProps = {
  remainingSeconds: number
}

export function Timer({ remainingSeconds }: TimerProps) {
  const isLow = remainingSeconds <= 300
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        Tempo restante
      </Typography>
      <Chip
        label={formatTime(remainingSeconds)}
        color={isLow ? 'error' : 'primary'}
        variant={isLow ? 'filled' : 'outlined'}
        size="small"
      />
    </Stack>
  )
}

