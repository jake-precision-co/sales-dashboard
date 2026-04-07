'use client'

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

type DayData = {
  date: string       // "Mar 25"
  calls: number
  avgScore: number
}

type Props = {
  data: DayData[]
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-3 text-sm shadow-xl">
      <p className="text-gray-300 font-medium mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-gray-300">{p.name}:</span>
          <span className="text-white font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function DailyChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-56 flex items-center justify-center text-gray-300 text-sm">
        No data for this period
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#555', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: '#555', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fill: '#555', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend
          wrapperStyle={{ paddingTop: 12, fontSize: 12, color: '#666' }}
        />
        <Bar
          yAxisId="left"
          dataKey="calls"
          name="Calls Scored"
          fill="#3b82f6"
          opacity={0.7}
          radius={[3, 3, 0, 0]}
          maxBarSize={40}
        />
        <Line
          yAxisId="right"
          dataKey="avgScore"
          name="Avg Score"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ fill: '#f59e0b', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
