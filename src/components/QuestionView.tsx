import { memo } from 'react'
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material'
import type { QuestionItem } from '../models/types'
import { sanitizeHtml } from '../utils/sanitizeHtml'

export type QuestionViewProps = {
  question: QuestionItem
  selectedAnswer: number | null
  onAnswer: (answerCodigo: number) => void
}

export const QuestionView = memo(function QuestionView({
  question,
  selectedAnswer,
  onAnswer,
}: QuestionViewProps) {
  const hasInlineAnexos = question.campoQuestao?.includes('divAnexo')
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Questao {question.numeroQuestao} • {question.materia}
        </Typography>
        <Box
          sx={{
            '& img': { maxWidth: '100%', height: 'auto' },
            '& p': { marginBottom: 1.5 },
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.campoQuestao, question.anexosQuestoes) }}
        />
        {question.anexosQuestoes?.length && !hasInlineAnexos ? (
          <Stack spacing={1}>
            {question.anexosQuestoes.map((anexo) => (
              <Box
                key={anexo.link}
                component="img"
                src={anexo.link}
                alt="Anexo da questao"
                sx={{ maxWidth: '100%', borderRadius: 2 }}
              />
            ))}
          </Stack>
        ) : null}
      </Stack>
      <FormControl>
        <RadioGroup
          value={selectedAnswer ?? ''}
          onChange={(event) => onAnswer(Number(event.target.value))}
        >
          {question.respostasQuestoes.map((resposta) => (
            <FormControlLabel
              key={resposta.codigo}
              value={resposta.codigo}
              control={<Radio />}
              label={
                <Stack spacing={1}>
                  <Box
                    sx={{
                      '& img': { maxWidth: '100%', height: 'auto' },
                      '& p': { margin: 0 },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(resposta.textoResposta, resposta.anexoResposta),
                    }}
                  />
                  {!/<img/i.test(resposta.textoResposta) && resposta.anexoResposta?.length ? (
                    <Stack spacing={1}>
                      {resposta.anexoResposta.map((anexo) => (
                        <Box
                          key={anexo.link}
                          component="img"
                          src={anexo.link}
                          alt="Anexo da resposta"
                          sx={{ maxWidth: '100%', borderRadius: 2 }}
                        />
                      ))}
                    </Stack>
                  ) : null}
                </Stack>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  )
})

