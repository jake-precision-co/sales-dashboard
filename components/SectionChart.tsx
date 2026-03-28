'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type Section = { name: string; score: number; max: number }

export default function SectionChart({ sections }: { sections: Section[] }) {
  const data = sections.map(s => ({
    name: s.name.length > 20 ? s.name.substring(0, 18) + '…' : s.name,
    fullName: s.name,
    score: s.score,
    max: s.max,
    pct: Math.round((s.score / s.max) * 100),
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={160} />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid #374151', borderRadius: 8 }}
          labelStyle={{ color: '#e5e7eb' }}
          formatter={(value, name, props) => [`${props.payload.score}/${props.payload.max} (${props.payload.pct}%)`, props.payload.fullName]}
        />
        <Bar dataKey="pct" radius={4}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.pct >= 70 ? '#22c55e' : entry.pct >= 50 ? '#eab308' : '#ef4444'}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
