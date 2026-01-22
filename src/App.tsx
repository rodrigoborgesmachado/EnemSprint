import { Box, Container, Link, Stack, Typography } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { TestRunnerPage } from './pages/TestRunnerPage'
import { ResultPage } from './pages/ResultPage'

export function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(circle at top, #f5f1e8 0%, #f7f9fb 45%, #f0f4f8 100%)',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test/:codigo" element={<TestRunnerPage />} />
          <Route path="/result/:codigo" element={<ResultPage />} />
        </Routes>
      </Box>
      <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', py: 3 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Link
                href="https://www.sunsalesystem.com.br/"
                target="_blank"
                rel="noreferrer"
                underline="hover"
                color="text.primary"
                fontWeight={600}
              >
                SunSale System
              </Link>
              <Typography variant="caption" color="text.secondary">
                (c) {new Date().getFullYear()} - Todos os direitos reservados.
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

