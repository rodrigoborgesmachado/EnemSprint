import { Box, Container, Divider, Link, List, ListItem, Typography } from '@mui/material'

export function PrivacyPolicyPage() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Politica de Privacidade
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Transparencia sobre como o EnemSprint trata dados durante o uso da plataforma.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h5" gutterBottom>
          O que e o EnemSprint
        </Typography>
        <List>
          <ListItem>
            O EnemSprint e uma plataforma para treinar provas do ENEM, IFTM e UFU usando a
            API publica do SunSale System.
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          Dados que coletamos
        </Typography>
        <List>
          <ListItem>O EnemSprint nao exige conta ou login.</ListItem>
          <ListItem>
            Durante a sessao, respostas e tempo ficam apenas em memoria no navegador para
            permitir a simulacao e o resultado.
          </ListItem>
          <ListItem>Nao armazenamos permanentemente dados de respostas ou desempenho.</ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          Dados que NAO coletamos
        </Typography>
        <List>
          <ListItem>Dados pessoais sensiveis (como CPF, endereco, documentos).</ListItem>
          <ListItem>Dados de pagamento ou informacoes financeiras.</ListItem>
          <ListItem>Dados para perfil de anuncios ou publicidade comportamental.</ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          Cookies e rastreamento
        </Typography>
        <List>
          <ListItem>Nao usamos cookies de marketing ou rastreamento.</ListItem>
          <ListItem>O app nao integra bibliotecas de analytics.</ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          Uso da API publica
        </Typography>
        <List>
          <ListItem>
            As provas e questoes sao carregadas da API publica do SunSale:
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
            Como em qualquer servico web, o servidor pode registrar logs tecnicos como IP e
            user-agent para fins de operacao e seguranca.
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          Conteudo das questoes
        </Typography>
        <List>
          <ListItem>
            As questoes sao exibidas conforme fornecidas pela API publica.
          </ListItem>
          <ListItem>
            O HTML recebido e higienizado com DOMPurify para reduzir riscos de conteudo malicioso.
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          Seguranca
        </Typography>
        <List>
          <ListItem>Utilizamos HTTPS nas requisicoes a API.</ListItem>
          <ListItem>Higienizamos HTML para evitar injecoes.</ListItem>
          <ListItem>Recomendamos manter o navegador atualizado.</ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          Seus direitos e contato
        </Typography>
        <List>
          <ListItem>
            Em caso de duvidas, entre em contato: contato@sunsalesystem.com.br
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          Alteracoes nesta politica
        </Typography>
        <List>
          <ListItem>Esta politica pode ser atualizada a qualquer momento.</ListItem>
          <ListItem>Ultima atualizacao: 2026-01-26</ListItem>
        </List>
      </Container>
    </Box>
  )
}
