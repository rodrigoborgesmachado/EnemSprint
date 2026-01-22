import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { TestSessionProvider } from './context/TestSessionContext'
import './index.css'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1e4d6b' },
    secondary: { main: '#f38b2a' },
    background: { default: '#f7f9fb', paper: '#ffffff' },
  },
  typography: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <TestSessionProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TestSessionProvider>
  </ThemeProvider>
)

