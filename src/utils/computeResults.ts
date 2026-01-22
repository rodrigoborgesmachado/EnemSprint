import type { MateriaStats, PerQuestionResult, QuestionItem, TestResults } from '../models/types'

export function computeResults(
  questions: QuestionItem[],
  answers: Record<number, number>
): TestResults {
  let correctCount = 0
  let wrongCount = 0
  let blankCount = 0

  const perMateriaMap = new Map<string, MateriaStats>()
  const perQuestion: PerQuestionResult[] = questions.map((question) => {
    const correctAnswer = question.respostasQuestoes.find((item) => item.certa)
    const correctAnswerCodigo = correctAnswer ? correctAnswer.codigo : null
    const userAnswerCodigo = answers[question.Id] ?? null
    const isCorrect = userAnswerCodigo !== null && userAnswerCodigo === correctAnswerCodigo

    if (userAnswerCodigo === null) {
      blankCount += 1
    } else if (isCorrect) {
      correctCount += 1
    } else {
      wrongCount += 1
    }

    const materiaKey = question.materia || 'Sem materia'
    const currentStats = perMateriaMap.get(materiaKey) ?? {
      materia: materiaKey,
      correct: 0,
      wrong: 0,
      blank: 0,
      total: 0,
    }

    currentStats.total += 1
    if (userAnswerCodigo === null) {
      currentStats.blank += 1
    } else if (isCorrect) {
      currentStats.correct += 1
    } else {
      currentStats.wrong += 1
    }
    perMateriaMap.set(materiaKey, currentStats)

    return {
      questionId: question.Id,
      numeroQuestao: question.numeroQuestao,
      materia: materiaKey,
      campoQuestao: question.campoQuestao,
      anexosQuestoes: question.anexosQuestoes,
      respostasQuestoes: question.respostasQuestoes,
      correctAnswerCodigo,
      userAnswerCodigo,
      isCorrect,
    }
  })

  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  return {
    correctCount,
    wrongCount,
    blankCount,
    percentage,
    perMateria: Array.from(perMateriaMap.values()),
    perQuestion,
  }
}

