import { readFileSync } from 'fs'
import { join } from 'path'
import Nav from '@/components/Nav'
import CustomerVoiceAccordion from '@/components/CustomerVoiceAccordion'

const SECTIONS = [
  { key: 'pain-buckets', emoji: '🪣', title: 'Pain Buckets' },
  { key: 'prospect-roadblocks', emoji: '🚧', title: 'Roadblocks' },
  { key: 'prospect-dreams', emoji: '💭', title: 'Dreams' },
  { key: 'prospect-objections', emoji: '❌', title: 'Objections' },
]

export default function CustomerVoicePage() {
  const sections = SECTIONS.map(s => ({
    ...s,
    content: readFileSync(
      join(process.cwd(), 'data', 'customer-voice', `${s.key}.md`),
      'utf8'
    ),
  }))

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white tracking-tight">Customer Voice</h1>
          <p className="text-gray-500 text-sm mt-1">Intelligence from the field — pain, roadblocks, dreams, objections.</p>
        </div>
        <div className="flex flex-col gap-3">
          {sections.map(s => (
            <CustomerVoiceAccordion
              key={s.key}
              emoji={s.emoji}
              title={s.title}
              content={s.content}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
