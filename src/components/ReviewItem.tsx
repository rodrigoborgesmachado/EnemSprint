import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { PerQuestionResult } from '../models/types'
import { sanitizeHtml } from '../utils/sanitizeHtml'

export type ReviewItemProps = {
  item: PerQuestionResult
}

function getAnswerHtml(item: PerQuestionResult, codigo: number | null): string {
  if (codigo === null) return 'Em branco'
  const found = item.respostasQuestoes.find((resposta) => resposta.codigo === codigo)
  if (!found) return 'Resposta nao encontrada'
  return sanitizeHtml(found.textoResposta, found.anexoResposta)
}

export function ReviewItem({ item }: ReviewItemProps) {
  const hasInlineAnexos = item.campoQuestao?.includes('divAnexo')
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
          <Typography variant="subtitle2">Questao {item.numeroQuestao}</Typography>
          <Chip
            size="small"
            label={item.isCorrect ? 'Correta' : item.userAnswerCodigo ? 'Incorreta' : 'Em branco'}
            color={item.isCorrect ? 'success' : item.userAnswerCodigo ? 'error' : 'warning'}
          />
          <Typography variant="caption" color="text.secondary">
            {item.materia}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Box
            sx={{ '& img': { maxWidth: '100%', height: 'auto' }, '& p': { marginBottom: 1 } }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.campoQuestao, item.anexosQuestoes) }}
          />
          {item.anexosQuestoes?.length && !hasInlineAnexos ? (
            <Stack spacing={1}>
              {item.anexosQuestoes.map((anexo) => (
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
          <Stack spacing={1}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Sua resposta
              </Typography>
              <Box
                sx={{ '& img': { maxWidth: '100%', height: 'auto' }, '& p': { margin: 0 } }}
                dangerouslySetInnerHTML={{ __html: getAnswerHtml(item, item.userAnswerCodigo) }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Resposta correta
              </Typography>
              <Box
                sx={{ '& img': { maxWidth: '100%', height: 'auto' }, '& p': { margin: 0 } }}
                dangerouslySetInnerHTML={{ __html: getAnswerHtml(item, item.correctAnswerCodigo) }}
              />
            </Box>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

