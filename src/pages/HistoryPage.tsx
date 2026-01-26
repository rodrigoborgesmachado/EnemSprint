import {


  Box,


  Button,


  Container,


  Dialog,


  DialogActions,


  DialogContent,


  DialogTitle,


  Divider,


  MenuItem,


  Paper,


  Select,


  Stack,


  Table,


  TableBody,


  TableCell,


  TableHead,


  TableRow,


  TextField,


  Typography,


} from '@mui/material'


import { useMemo, useState } from 'react'


import { clearHistory, deleteAttempt, getHistory, type ExamType, type StoredAttempt } from '../storage/historyStorage'





const formatDate = (value: string) =>


  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))





export function HistoryPage() {


  const [attempts, setAttempts] = useState<StoredAttempt[]>(() => getHistory())


  const [search, setSearch] = useState('')


  const [examFilter, setExamFilter] = useState<ExamType | 'ALL'>('ALL')


  const [expanded, setExpanded] = useState<string | null>(null)


  const [deleteId, setDeleteId] = useState<string | null>(null)


  const [clearOpen, setClearOpen] = useState(false)





  const filteredAttempts = useMemo(() => {


    const term = search.trim().toLowerCase()


    return attempts.filter((attempt) => {


      if (examFilter !== 'ALL' && attempt.examType !== examFilter) return false


      if (!term) return true


      return attempt.testName.toLowerCase().includes(term) || attempt.testCode.includes(term)


    })


  }, [attempts, examFilter, search])





  const summary = useMemo(() => {


    if (attempts.length === 0) {


      return { total: 0, best: null as StoredAttempt | null, latest: null as StoredAttempt | null }


    }


    const best = attempts.reduce((acc, current) =>


      current.totals.scorePercent > acc.totals.scorePercent ? current : acc


    )


    return { total: attempts.length, best, latest: attempts[0] }


  }, [attempts])





  const handleDelete = () => {


    if (!deleteId) return


    deleteAttempt(deleteId)


    setAttempts(getHistory())


    setDeleteId(null)


  }





  const handleClear = () => {


    clearHistory()


    setAttempts([])


    setClearOpen(false)


  }





  return (


    <Box sx={{ py: { xs: 4, md: 6 } }}>


      <Container maxWidth="lg">


        <Stack spacing={3}>


          <Stack spacing={1}>


            <Typography variant="h4">Resultados</Typography>


            <Typography variant="body1" color="text.secondary">


              Acompanhe seus simulados anteriores e veja sua evolução.


            </Typography>


          </Stack>





          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>


            <Stack spacing={2}>


              <Typography variant="h6">Resumo</Typography>


              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>


                <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>


                  <Typography variant="caption" color="text.secondary">


                    Total de simulados


                  </Typography>


                  <Typography variant="h5">{summary.total}</Typography>


                </Paper>


                <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>


                  <Typography variant="caption" color="text.secondary">


                    Melhor nota


                  </Typography>


                  <Typography variant="h5">


                    {summary.best ? `${summary.best.totals.scorePercent.toFixed(1)}%` : '--'}


                  </Typography>


                </Paper>


                <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>


                  <Typography variant="caption" color="text.secondary">


                    Última atividade


                  </Typography>


                  <Typography variant="h6">


                    {summary.latest ? formatDate(summary.latest.createdAt) : '--'}


                  </Typography>


                </Paper>


              </Stack>


            </Stack>


          </Paper>





          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>


            <Stack spacing={2}>


              <Typography variant="h6">Filtros</Typography>


              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>


                <TextField


                  label="Buscar por prova"


                  value={search}


                  onChange={(event) => setSearch(event.target.value)}


                  fullWidth


                />


                <Select value={examFilter} onChange={(event) => setExamFilter(event.target.value as ExamType | 'ALL')}>


                  <MenuItem value="ALL">Todas as provas</MenuItem>


                  <MenuItem value="ENEM">ENEM</MenuItem>


                  <MenuItem value="IFTM">IFTM</MenuItem>


                  <MenuItem value="UFU">UFU</MenuItem>


                  <MenuItem value="UNKNOWN">Outras</MenuItem>


                </Select>


                <Button color="error" variant="outlined" onClick={() => setClearOpen(true)}>


                  Limpar histórico


                </Button>


              </Stack>


            </Stack>


          </Paper>





          <Divider />





          {filteredAttempts.length === 0 ? (


            <Typography variant="body2" color="text.secondary">


              Você ainda não concluiu nenhum simulado. Faça uma prova e seus resultados aparecerão aqui.


            </Typography>


          ) : (


            <Stack spacing={2}>


              {filteredAttempts.map((attempt) => (


                <Paper key={attempt.attemptId} variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>


                  <Stack spacing={2}>


                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">


                      <Box>


                        <Typography variant="h6">


                          {attempt.testName || `Prova ${attempt.testCode}`}


                        </Typography>


                        <Typography variant="body2" color="text.secondary">


                          {formatDate(attempt.createdAt)} • {attempt.examType}


                        </Typography>


                      </Box>


                      <Stack direction="row" spacing={2} alignItems="center">


                        <Typography variant="h6">{attempt.totals.scorePercent.toFixed(1)}%</Typography>


                        <Button


                          size="small"


                          variant="outlined"


                          onClick={() => setExpanded(expanded === attempt.attemptId ? null : attempt.attemptId)}


                        >


                          {expanded === attempt.attemptId ? 'Ocultar detalhes' : 'Ver detalhes'}


                        </Button>


                        <Button


                          size="small"


                          color="error"


                          variant="outlined"


                          onClick={() => setDeleteId(attempt.attemptId)}


                        >


                          Excluir


                        </Button>


                      </Stack>


                    </Stack>





                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>


                      <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>


                        <Typography variant="caption" color="text.secondary">


                          Acertos


                        </Typography>


                        <Typography variant="h6">{attempt.totals.correct}</Typography>


                      </Paper>


                      <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>


                        <Typography variant="caption" color="text.secondary">


                          Erros


                        </Typography>


                        <Typography variant="h6">{attempt.totals.wrong}</Typography>


                      </Paper>


                      <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>


                        <Typography variant="caption" color="text.secondary">


                          Em branco


                        </Typography>


                        <Typography variant="h6">{attempt.totals.blank}</Typography>


                      </Paper>


                    </Stack>





                    {expanded === attempt.attemptId && attempt.subjectStats ? (


                      <Box>


                        <Typography variant="subtitle1" gutterBottom>


                          Performance por matéria


                        </Typography>


                        <Table size="small">


                          <TableHead>


                            <TableRow>


                              <TableCell>Matéria</TableCell>


                              <TableCell align="right">Total</TableCell>


                              <TableCell align="right">Acertos</TableCell>


                              <TableCell align="right">Erros</TableCell>


                              <TableCell align="right">Em branco</TableCell>


                              <TableCell align="right">% de acerto</TableCell>


                            </TableRow>


                          </TableHead>


                          <TableBody>


                            {attempt.subjectStats.map((item) => (


                              <TableRow key={`${attempt.attemptId}-${item.subject}`}>


                                <TableCell>{item.subject}</TableCell>


                                <TableCell align="right">{item.total}</TableCell>


                                <TableCell align="right">{item.correct}</TableCell>


                                <TableCell align="right">{item.wrong}</TableCell>


                                <TableCell align="right">{item.blank}</TableCell>


                                <TableCell align="right">{item.accuracy.toFixed(1)}%</TableCell>


                              </TableRow>


                            ))}


                          </TableBody>


                        </Table>


                      </Box>


                    ) : null}


                  </Stack>


                </Paper>


              ))}


            </Stack>


          )}


        </Stack>


      </Container>





      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>


        <DialogTitle>Excluir resultado</DialogTitle>


        <DialogContent>


          <Typography variant="body2" color="text.secondary">


            Tem certeza que deseja excluir este resultado?


          </Typography>


        </DialogContent>


        <DialogActions>


          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>


          <Button color="error" variant="contained" onClick={handleDelete}>


            Excluir


          </Button>


        </DialogActions>


      </Dialog>





      <Dialog open={clearOpen} onClose={() => setClearOpen(false)}>


        <DialogTitle>Limpar histórico</DialogTitle>


        <DialogContent>


          <Typography variant="body2" color="text.secondary">


            Deseja remover todos os resultados salvos?


          </Typography>


        </DialogContent>


        <DialogActions>


          <Button onClick={() => setClearOpen(false)}>Cancelar</Button>


          <Button color="error" variant="contained" onClick={handleClear}>


            Limpar histórico


          </Button>


        </DialogActions>


      </Dialog>


    </Box>


  )


}


