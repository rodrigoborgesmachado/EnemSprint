import { Box, Container, Divider, Link, List, ListItem, Paper, Typography } from '@mui/material'

export function PrivacyPolicyPage() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" gutterBottom>
            Política de Privacidade
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Transparência sobre como o EnemSprint trata dados durante o uso da plataforma.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" gutterBottom>
            O que é o EnemSprint
          </Typography>
          <List>
            <ListItem>
              O EnemSprint é uma plataforma para treinar provas do ENEM, IFTM e UFU usando a
              API pública do SunSale System.
            </ListItem>
          </List>

          <Typography variant="h5" gutterBottom>
            Dados que coletamos
          </Typography>
          <List>
            <ListItem>O EnemSprint não exige conta ou login.</ListItem>
            <ListItem>
              O histórico de resultados é armazenado localmente no seu dispositivo via localStorage
              (chave: "enemsprint.history.v1").
            </ListItem>
            <ListItem>
              Esses dados não são enviados a terceiros e podem ser apagados pelo usuário no botão
              “Limpar histórico”.
            </ListItem>
            <ListItem>
              Durante a sessão, respostas e tempo ficam apenas em memória no navegador para
              permitir a simulação e o resultado.
            </ListItem>
          </List>

          <Typography variant="h5" gutterBottom>
            Dados que NÃO coletamos
          </Typography>
          <List>
            <ListItem>Dados pessoais sensíveis (como CPF, endereço, documentos).</ListItem>
            <ListItem>Dados de pagamento ou informações financeiras.</ListItem>
            <ListItem>Dados para perfil de anúncios ou publicidade comportamental.</ListItem>
          </List>

          <Typography variant="h5" gutterBottom>
            Cookies e rastreamento
          </Typography>
          <List>
            <ListItem>Não usamos cookies de marketing ou rastreamento.</ListItem>
            <ListItem>O app não integra bibliotecas de analytics.</ListItem>
          </List>

          <Typography variant="h5" gutterBottom>
            Uso da API pública
          </Typography>
          <List>
            <ListItem>
              As provas e questões são carregadas da API pública do SunSale:
              <Link
                href="https://apisunsale.azurewebsites.net/api/PublicQuestoes"
                target="_blank"
                rel="noreferrer"
                sx={{ ml: 0.5 }}
              >
                https://apisunsale.azurewebsites.net/api/PublicQuestoes
              </Link>
            </ListItem>
            <ListItem>
              Como em qualquer serviço web, o servidor pode registrar logs técnicos como IP e
              user-agent para fins de operação e segurança.
            </ListItem>
          </List>

          <Typography variant="h5" gutterBottom>
            Conteúdo das questões
          </Typography>
          <List>
            <ListItem>
              As questões são exibidas conforme fornecidas pela API pública.
            </ListItem>
            <ListItem>
              O HTML recebido é higienizado com DOMPurify para reduzir riscos de conteúdo malicioso.
            </ListItem>
          </List>

          <Typography variant="h5" gutterBottom>
            Segurança
          </Typography>
          <List>
            <ListItem>Utilizamos HTTPS nas requisições à API.</ListItem>
            <ListItem>Higienizamos HTML para evitar injeções.</ListItem>
            <ListItem>Recomendamos manter o navegador atualizado.</ListItem>
          </List>

          <Typography variant="h5" gutterBottom>
            Seus direitos e contato
          </Typography>
          <List>
            <ListItem>
              Em caso de dúvidas, entre em contato: contato@sunsalesystem.com.br
            </ListItem>
          </List>

          <Typography variant="h5" gutterBottom>
            Alterações nesta política
          </Typography>
          <List>
            <ListItem>Esta política pode ser atualizada a qualquer momento.</ListItem>
            <ListItem>Última atualização: 2026-01-27</ListItem>
          </List>
        </Paper>
      </Container>
    </Box>
  )
}
