import { Alert, Box, Button, Container, Divider, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { type FormEvent, useMemo, useState } from 'react'

type FieldErrors = {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CONTACT_API_URL = 'https://apisunsale.azurewebsites.net/api/email/enviaEmailContato'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [school, setSchool] = useState('')
  const [subject, setSubject] = useState('Contato')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const trimmed = useMemo(
    () => ({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    }),
    [name, email, subject, message]
  )

  const validate = () => {
    const nextErrors: FieldErrors = {}

    if (trimmed.name.length < 2) {
      nextErrors.name = 'Informe seu nome (minimo 2 caracteres).'
    }
    if (!emailRegex.test(trimmed.email)) {
      nextErrors.email = 'Informe um e-mail valido.'
    }
    if (trimmed.subject.length < 2) {
      nextErrors.subject = 'Informe um assunto (minimo 2 caracteres).'
    }
    if (trimmed.message.length < 10) {
      nextErrors.message = 'A mensagem deve ter pelo menos 10 caracteres.'
    } else if (trimmed.message.length > 1000) {
      nextErrors.message = 'A mensagem deve ter no maximo 1000 caracteres.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowSuccess(false)
    setErrorMessage(null)
    if (!validate()) return
    if (isSubmitting) return

    setIsSubmitting(true)
    const payload = {
      Nome: trimmed.name,
      Email: trimmed.email,
      Empresa: company.trim(),
      Escola: school.trim(),
      Assunto: trimmed.subject,
      Mensagem: trimmed.message,
    }

    fetch(CONTACT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Servico indisponivel no momento.')
        }
        const data = (await response.json()) as { success?: boolean }
        if (!data.success) {
          throw new Error('Servico indisponivel no momento.')
        }
        setShowSuccess(true)
        setName('')
        setEmail('')
        setCompany('')
        setSchool('')
        setSubject('Contato')
        setMessage('')
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Servico indisponivel no momento.'
        setErrorMessage(message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Contato</Typography>
            <Typography variant="body1" color="text.secondary">
              Fale com a SunSale System pelos canais oficiais abaixo. Respondemos o mais rapido possivel em dias uteis.
            </Typography>
          </Stack>

          <Divider />

          <Box>
            <Typography variant="h5" gutterBottom>
              Canais
            </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Site:{' '}
              <Link href="https://www.sunsalesystem.com.br/" target="_blank" rel="noreferrer" underline="hover">
                sunsalesystem.com.br
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              LinkedIn:{' '}
              <Link
                href="https://www.linkedin.com/company/sunsale-system/"
                target="_blank"
                rel="noreferrer"
                underline="hover"
              >
                /company/sunsale-system
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              GitHub:{' '}
              <Link href="https://github.com/rodrigoborgesmachado" target="_blank" rel="noreferrer" underline="hover">
                github.com/rodrigoborgesmachado
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              WhatsApp:{' '}
              <Link href="https://wa.me/553499798100" target="_blank" rel="noreferrer" underline="hover">
                +55 34 99798-8100
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email:{' '}
              <Link href="mailto:contato@sunsalesystem.com.br" underline="hover">
                contato@sunsalesystem.com.br
              </Link>
            </Typography>
          </Stack>
        </Box>

          <Divider />

          <Box>
            <Typography variant="h5" gutterBottom>
              Formulario
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Se preferir, envie uma mensagem descrevendo sua duvida e o contexto de uso do EnemSprint.
            </Typography>
            <Paper sx={{ p: { xs: 2, md: 3 } }} variant="outlined">
              <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                <TextField
                  label="Nome"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  required
                  fullWidth
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Instituicao de ensino (opcional)"
                    value={school}
                    onChange={(event) => setSchool(event.target.value)}
                    fullWidth
                  />
                </Stack>
                <TextField
                  label="Assunto"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  error={Boolean(errors.subject)}
                  helperText={errors.subject}
                  required
                  fullWidth
                />
                <TextField
                  label="Mensagem"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  error={Boolean(errors.message)}
                  helperText={errors.message}
                  required
                  multiline
                  minRows={4}
                  inputProps={{ maxLength: 1000 }}
                  fullWidth
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    Enviar
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Nos nao armazenamos as mensagens no aplicativo. O envio ocorre pela API da SunSale.
                  </Typography>
                </Stack>
                {showSuccess ? (
                  <Alert severity="success">
                    Mensagem enviada com sucesso. Em breve retornaremos o contato.
                  </Alert>
                ) : null}
                {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
