import { Box, Button, Stack, Typography } from '@mui/material'

export type QuestionGridProps = {
  total: number
  currentIndex: number
  answeredIds: Set<number>
  questionIds: number[]
  onSelect: (index: number) => void
}

export function QuestionGrid({ total, currentIndex, answeredIds, questionIds, onSelect }: QuestionGridProps) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        Navegação rápida
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
          gap: 1,
        }}
      >
        {questionIds.map((id, index) => {
          const isCurrent = index === currentIndex
          const isAnswered = answeredIds.has(id)
          return (
            <Button
              key={id}
              size="small"
              variant={isCurrent ? 'contained' : isAnswered ? 'outlined' : 'text'}
              color={isAnswered ? 'success' : 'primary'}
              onClick={() => onSelect(index)}
            >
              {index + 1}
            </Button>
          )
        })}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {currentIndex + 1} / {total}
      </Typography>
    </Stack>
  )
}

