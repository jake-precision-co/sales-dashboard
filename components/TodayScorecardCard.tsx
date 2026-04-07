import Link from 'next/link'
import type { Scorecard } from '@/lib/parseScorecard'
import { scoreColorClass, typeBadgeStyle } from '@/lib/parseScorecard'

type Props = {
  card: Scorecard
  /** Slightly larger score + optional glow — Call of the Day only */
  featured?: boolean
}

/**
 * Shared card for Today: Call of the Day + Today&apos;s Scored Calls grid.
 * Same layout: type + call date, prospect, company/rep, score, outcome, magic moment, footer.
 */
export default function TodayScorecardCard({ card, featured }: Props) {
  return (
    <Link href={`/scorecard/${card.id}`} className="block group h-full">
      <div
        className={`bg-[#111] border border-[#222] rounded-2xl p-5 h-full flex flex-col hover:border-[#333] transition-all ${
          featured ? 'glow-gold' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center"
                style={typeBadgeStyle(card.type)}
              >
                {card.type}
              </span>
              <span className="text-gray-400 text-xs tabular-nums">Scored {card.scoredDate}</span>
            </div>
            <div className="text-gray-500 text-xs tabular-nums mb-0.5">Call: {card.callDate}</div>
            <h2 className="text-white font-bold text-xl leading-snug truncate">{card.prospectName}</h2>
            <p className="text-gray-400 text-sm truncate mt-0.5">{card.company || card.rep}</p>
          </div>
          <div className="text-right shrink-0">
            <span
              className={`font-black tabular-nums leading-none ${featured ? 'text-5xl' : 'text-4xl'} ${scoreColorClass(card.score)}`}
            >
              {card.score}
            </span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-300 bg-[#0f0f0f] rounded-lg px-3 py-2 truncate border border-[#1a1a1a]">
          {card.outcome}
        </div>

        {card.magicMoment && (
          <div className="mt-4 border-t border-[#1a1a1a] pt-4">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1.5">✦ Magic Moment</p>
            <p className="text-gray-300 text-sm italic leading-relaxed line-clamp-2">
              &quot;{card.magicMoment}&quot;
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 group-hover:text-gray-200 transition">
          <span>View full scorecard</span>
          <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  )
}
