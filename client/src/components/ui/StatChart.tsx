import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface StatChartProps {
  todo: number
  inProgress: number
  done: number
}

const COLORS = ['#7F77DD', '#EF9F27', '#5DCAA5']

export const StatChart = ({ todo, inProgress, done }: StatChartProps) => {
  const data = [
    { name: 'À faire', value: todo },
    { name: 'En cours', value: inProgress },
    { name: 'Terminé', value: done },
  ].filter(d => d.value > 0)

  if (data.length === 0) return (
    <div className="flex items-center justify-center h-32 text-sm text-gray-400">
      Aucune donnée disponible
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={65}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`${value} tâche${value > 1 ? 's' : ''}`, '']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}