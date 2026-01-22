import { Box, Stack, Typography } from '@mui/material'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TestResults } from '../models/types'

export type ResultChartsProps = {
  results: TestResults
}

const pieColors = ['#2e7d32', '#d32f2f', '#f9a825']

export function ResultCharts({ results }: ResultChartsProps) {
  const pieData = [
    { name: 'Corretas', value: results.correctCount },
    { name: 'Erradas', value: results.wrongCount },
    { name: 'Brancas', value: results.blankCount },
  ]

  const barData = results.perMateria.map((item) => ({
    materia: item.materia,
    acertos: item.correct,
    erradas: item.wrong,
    brancas: item.blank,
  }))

  return (
    <Stack spacing={4}>
      <Box sx={{ width: '100%', height: 280 }}>
        <Typography variant="subtitle1" gutterBottom>
          Distribuicao geral
        </Typography>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
              {pieData.map((_, index) => (
                <Cell key={index} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ width: '100%', height: 320 }}>
        <Typography variant="subtitle1" gutterBottom>
          Desempenho por materia
        </Typography>
        <ResponsiveContainer>
          <BarChart data={barData} margin={{ left: 8, right: 8 }}>
            <XAxis dataKey="materia" interval={0} angle={-10} textAnchor="end" height={70} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="acertos" fill="#2e7d32" />
            <Bar dataKey="erradas" fill="#d32f2f" />
            <Bar dataKey="brancas" fill="#f9a825" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  )
}

