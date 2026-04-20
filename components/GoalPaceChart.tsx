'use client'

type GoalMetric = {
  label: string
  sublabel: string
  current: number
  projected?: number   // end-of-month projection (optional; falls back to current)
  goal: number
  format?: 'number' | 'currency'
  color: string
  alwaysColor?: boolean
}

type Props = {
  metrics: GoalMetric[]
  pacePct: number  // days elapsed / days in month * 100
  daysElapsed: number
  daysInMonth: number
}

function fmt(n: number, format?: 'number' | 'currency') {
  if (format === 'currency') {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
    return `$${n}`
  }
  return String(n)
}

export default function GoalPaceChart({ metrics, pacePct, daysElapsed, daysInMonth }: Props) {
  return (
    <div className="space-y-6">
      {metrics.map((m) => {
        const displayValue = m.projected ?? m.current
        const pct = Math.min((displayValue / m.goal) * 100, 100)
        const ahead = pct >= 100
        const barColor = m.color
        const textColor = m.color.replace('bg-', 'text-')

        return (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-gray-300 text-sm font-semibold">{m.label}</span>
                <span className="text-gray-500 text-xs ml-2">{m.sublabel}</span>
              </div>
              <div className="text-right">
                <span className={`font-black text-lg tabular-nums ${textColor}`}>
                  {fmt(displayValue, m.format)}
                </span>
                <span className="text-gray-500 text-xs ml-1">/ {fmt(m.goal, m.format)}</span>
                <span className={`text-xs font-bold ml-2 ${textColor}`}>
                  {Math.round(pct)}%
                </span>
                {m.projected && (
                  <div className="text-gray-500 text-xs">MTD: {fmt(m.current, m.format)}</div>
                )}
              </div>
            </div>

            {/* Progress bar with pace marker */}
            <div className="relative h-3 bg-[#1a1a1a] rounded-full overflow-visible">
              {/* Actual progress */}
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${pct}%` }}
              />
              {/* Pace marker — where you should be today */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gray-500 rounded-full"
                style={{ left: `${Math.min(pacePct, 99)}%` }}
                title={`On-pace target: day ${daysElapsed} of ${daysInMonth}`}
              />
            </div>

            {(() => {
              const gap = displayValue - m.goal
              return (
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-xs ${ahead ? 'text-green-400' : 'text-red-400'} font-semibold`}>
                    {ahead
                      ? `↑ ${fmt(Math.abs(gap), m.format)} above goal`
                      : `↓ ${fmt(Math.abs(gap), m.format)} below goal`}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {fmt(Math.max(0, m.goal - displayValue), m.format)} left to goal
                  </span>
                </div>
              )
            })()}
          </div>
        )
      })}

      <p className="text-gray-500 text-xs pt-2 border-t border-[#1a1a1a]">
        Gray line = on-pace target · Day {daysElapsed} of {daysInMonth} ({Math.round(pacePct)}% through month)
      </p>
    </div>
  )
}
