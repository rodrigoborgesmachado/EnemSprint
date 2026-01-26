import { Box, Container, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink, Route, Routes, useLocation } from 'react-router-dom'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { TestRunnerPage } from './pages/TestRunnerPage'
import { ResultPage } from './pages/ResultPage'
import { Navbar } from './components/Navbar'

export function App() {
  const location = useLocation()
  const hideNavbar = location.pathname.startsWith('/test/')

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(circle at top, #f5f1e8 0%, #f7f9fb 45%, #f0f4f8 100%)',
      }}
    >
      {hideNavbar ? null : <Navbar />}
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test/:codigo" element={<TestRunnerPage />} />
          <Route path="/result/:codigo" element={<ResultPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/history" element={<HistoryPage />} />
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
            <Stack direction="row" spacing={2} alignItems="center">
              <Link
                component={RouterLink}
                to="/privacy"
                underline="hover"
                color="text.primary"
                fontWeight={600}
              >
                Politica de Privacidade
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                underline="hover"
                color="text.primary"
                fontWeight={600}
              >
                Sobre
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                underline="hover"
                color="text.primary"
                fontWeight={600}
              >
                Contato
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

