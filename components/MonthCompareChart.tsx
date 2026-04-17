'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

type DataPoint = {
  day: number         // day of month 1–31
  current?: number    // avg score this month
  prev?: number       // avg score last month
}

type Props = {
  data: DataPoint[]
  currentLabel: string
  prevLabel: string
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-3 text-sm shadow-xl">
      <p className="text-gray-300 font-medium mb-1.5">Day {label}</p>
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

export default function MonthCompareChart({ data, currentLabel, prevLabel }: Props) {
  if (!data.length) {
    return (
      <div className="h-56 flex items-center justify-center text-gray-400 text-sm">
        No data to compare
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: '#555', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `D${v}`}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#555', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)' }} />
        <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12, color: '#666' }} />
        <Line
          dataKey="prev"
          name={prevLabel}
          stroke="#4b5563"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
          activeDot={{ r: 4 }}
          connectNulls
        />
        <Line
          dataKey="current"
          name={currentLabel}
          stroke="#f59e0b"
          strokeWidth={2.5}
          dot={{ fill: '#f59e0b', r: 3 }}
          activeDot={{ r: 5 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
