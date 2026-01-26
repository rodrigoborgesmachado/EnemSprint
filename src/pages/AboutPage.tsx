import { Box, Container, Divider, Link, List, ListItem, Paper, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export function AboutPage() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" gutterBottom>
            Sobre o EnemSprint
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" gutterBottom>
            O que é o EnemSprint
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            O EnemSprint é uma plataforma online para praticar provas do ENEM, IFTM e UFU. Você
            pode simular condições reais de prova com cronômetro e correção automática. O objetivo
            é apoiar o estudo com foco em prática e desempenho.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Para quem é
          </Typography>
          <List>
            <ListItem>Estudantes do ENEM</ListItem>
            <ListItem>Candidatos ao IFTM e UFU</ListItem>
            <ListItem>Pessoas que querem treinar gestão de tempo e estratégia de prova</ListItem>
          </List>

          <Typography variant="h5" gutterBottom>
            Como funciona
          </Typography>
          <List>
            <ListItem>1. Escolha a prova</ListItem>
            <ListItem>2. Defina o tempo</ListItem>
            <ListItem>3. Responda às questões</ListItem>
            <ListItem>4. Veja o resultado com gráficos e revisão</ListItem>
          </List>

          <Typography variant="h5" gutterBottom>
            O que o EnemSprint NÃO é
          </Typography>
          <List>
            <ListItem>Não é um cursinho</ListItem>
            <ListItem>Não substitui estudo teórico</ListItem>
            <ListItem>Não garante aprovação</ListItem>
          </List>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            O EnemSprint é uma ferramenta complementar para treinar questões e estratégia.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Dados e privacidade
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Não é necessário login. As respostas são usadas apenas durante a sessão de prática.
            Veja mais detalhes na{' '}
            <Link component={RouterLink} to="/privacy" underline="hover">
              Política de Privacidade
            </Link>
            .
          </Typography>

          <Typography variant="h5" gutterBottom>
            Quem desenvolveu
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            O EnemSprint foi desenvolvido pela SunSale System, uma software house brasileira com
            foco em projetos educacionais e de impacto social. Saiba mais em{' '}
            <Link href="https://www.sunsalesystem.com.br/" target="_blank" rel="noreferrer" underline="hover">
              sunsalesystem.com.br
            </Link>
            .
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Projeto educacional em constante evolução.
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

