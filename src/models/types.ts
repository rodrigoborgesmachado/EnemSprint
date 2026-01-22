export type ApiResponse<T> = {
  message: string
  success: boolean
  quantity: number
  total: number
  object: T
}

export type TestItem = {
  codigo: number
  nomeProva: string
  tipoProva?: string
  dataAplicacao?: string
  linkProva?: string
  linkGabarito?: string
  banca?: string
}

export type RespostaQuestao = {
  codigo: number
  textoResposta: string
  certa: boolean
  anexoResposta?: AnexoQuestao[]
}

export type AnexoQuestao = {
  link: string
}

export type QuestionItem = {
  Id: number
  campoQuestao: string
  materia: string
  numeroQuestao: number
  respostasQuestoes: RespostaQuestao[]
  anexosQuestoes: AnexoQuestao[]
}

export type PerQuestionResult = {
  questionId: number
  numeroQuestao: number
  materia: string
  campoQuestao: string
  anexosQuestoes: AnexoQuestao[]
  respostasQuestoes: RespostaQuestao[]
  correctAnswerCodigo: number | null
  userAnswerCodigo: number | null
  isCorrect: boolean
}

export type MateriaStats = {
  materia: string
  correct: number
  wrong: number
  blank: number
  total: number
}

export type TestResults = {
  correctCount: number
  wrongCount: number
  blankCount: number
  percentage: number
  perMateria: MateriaStats[]
  perQuestion: PerQuestionResult[]
  elapsedSeconds?: number
}

