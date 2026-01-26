import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Início', to: '/' },
  { label: 'Sobre', to: '/about' },
  { label: 'Contato', to: '/contact' },
]

export function Navbar() {
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleStartNow = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      event.preventDefault()
      document.getElementById('tests')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Typography
              component={RouterLink}
              to="/"
              variant="h6"
              color="text.primary"
              sx={{ textDecoration: 'none', fontWeight: 700 }}
            >
              EnemSprint
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Button
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    color="inherit"
                    sx={{ fontWeight: isActive ? 700 : 500 }}
                  >
                    {link.label}
                  </Button>
                )
              })}
              <Button
                component={RouterLink}
                to="/#tests"
                variant="outlined"
                onClick={handleStartNow}
              >
                Começar agora
              </Button>
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton color="inherit" onClick={handleOpenMenu} aria-label="Abrir menu">
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleCloseMenu} keepMounted>
                {navLinks.map((link) => (
                  <MenuItem
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    onClick={handleCloseMenu}
                  >
                    {link.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
