import CountdownTimer from './CountdownTimer'

// 👇 Change this to update the workshop date everywhere
const WORKSHOP_DATE = new Date('2026-05-14T13:00:00-04:00')

export default function WorkshopPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white border-t-4 border-[#0098CE]">

      {/* ── Countdown Banner ── */}
      <section className="border-b border-white/10 bg-[#0f0f0f] py-8 px-4">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-[#0098CE] mb-6 uppercase">
          Live Workshop — Starts In
        </p>
        <CountdownTimer targetDate={WORKSHOP_DATE} />
      </section>

      {/* ── Hero ── */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Precision wordmark */}
        <div className="mb-6">
          <span className="text-white font-black text-sm tracking-[0.3em] uppercase">Preci</span><span className="text-[#0098CE] font-black text-sm tracking-[0.3em] uppercase">s</span><span className="text-white font-black text-sm tracking-[0.3em] uppercase">ion</span>
        </div>
        <p className="text-xs font-semibold tracking-[0.2em] text-[#0098CE] uppercase mb-4">
          Live Workshop
        </p>
        <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
          The Magnetic Microsite
        </h1>
        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
          Learn to build interactive lead magnets that attract qualified buyers — 10x faster, no designer, no code, endlessly repeatable
        </p>

        {/* Matt */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
            Matt V
          </div>
          <p className="text-white font-semibold text-base">Matt Verlaque · Precision</p>
          <p className="text-[#0098CE] font-semibold text-sm">500+ SaaS founders coached to $106M ARR</p>
        </div>
      </section>

      <hr className="border-white/10 my-12" />

      {/* ── The Case ── */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="space-y-5">
          <p className="text-2xl text-white font-bold leading-snug">You&apos;re working harder than you should to find customers.</p>
          <p className="text-2xl text-white font-bold leading-snug">Every conversation starts from scratch. Cold. No context. No trust built.</p>
          <p className="text-2xl text-white font-bold leading-snug">Your best buyers are out there — but they don&apos;t know you exist.</p>
          <p className="text-2xl text-[#0098CE] font-black leading-snug">That changes today.</p>
        </div>
      </section>

      <hr className="border-white/10 my-12" />

      {/* ── Logistics Bar ── */}
      <section className="border-y border-white/10 bg-[#0f0f0f] py-6 px-4">
        <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-300">
          <span>📅 [DATE PLACEHOLDER]</span>
          <span className="hidden sm:inline text-white/20">·</span>
          <span>⏰ [TIME] ET</span>
          <span className="hidden sm:inline text-white/20">·</span>
          <span>💻 Live on Zoom</span>
          <span className="hidden sm:inline text-white/20">·</span>
          <span>🎥 Recording included</span>
          <span className="hidden sm:inline text-white/20">·</span>
          <span className="font-semibold text-[#0098CE]">💰 $97</span>
        </div>
      </section>

      <hr className="border-white/10 my-12" />

      {/* ── What We'll Cover ── */}
      <section className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-4xl font-black text-white mb-10">Here&apos;s what we&apos;ll cover</h2>
        <div className="space-y-8">
          {[
            {
              title: 'Why your PDF is killing your pipeline — and the 4 shifts that fix it',
              body: 'Static to interactive. Generic to personalized. Information to outcomes.',
            },
            {
              title: 'The Beacon Filter — grade your lead magnet idea before you build',
              body: '5 filters every great lead magnet must pass. We run your idea through live.',
            },
            {
              title: 'The Format Match Matrix — pick the right format for the win you want',
              body: 'Calculator, quiz, prompt pack, plan builder — wrong format kills great ideas.',
            },
            {
              title: 'The 3 Laws of magnetic lead magnets',
              body: 'Quick win. Clear next step. Format matches the win. Nail these three.',
            },
            {
              title: 'Live build inside Manus — no designer, no developer, no code',
              body: 'You ship a functional, live lead magnet before this call ends.',
            },
            {
              title: 'The qualification architecture — filter bad-fit buyers before the first call',
              body: 'The right questions inside your microsite separate pipeline from time-wasters.',
            },
          ].map(({ title, body }, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-[#0098CE] font-bold text-lg mt-0.5 shrink-0">{i + 1}.</span>
              <div>
                <p className="font-semibold text-white mb-1">{title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-white/10 my-12" />

      {/* ── What You Walk Away With ── */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <h2 className="text-4xl font-black text-white mb-10">What You Ship on This Call</h2>

        <div className="space-y-6">
          {[
            {
              icon: '✅',
              title: 'A live, published microsite lead magnet',
              body: 'A real, working page on the internet — not a wireframe.',
            },
            {
              icon: '✅',
              title: 'The Beacon Filter',
              body: 'Score every idea across 5 gates. Only the strongest becomes your lead magnet.',
            },
            {
              icon: '✅',
              title: 'The Format Match Matrix',
              body: 'Know exactly which format fits any offer or audience.',
            },
            {
              icon: '✅',
              title: 'The 3 Laws of magnetic lead magnets',
              body: 'The framework behind every lead magnet that generates pipeline.',
            },
            {
              icon: '✅',
              title: 'A clear next step wired into your microsite',
              body: 'Your CTA moves qualified buyers straight into your sales process.',
            },
          ].map(({ icon, title, body }, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-lg shrink-0 mt-0.5">{icon}</span>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-gray-400 text-sm mt-0.5">{body}</p>
              </div>
            </div>
          ))}

          {/* Bonus */}
          <div className="mt-8 border border-[#0098CE]/30 rounded-lg p-5 bg-[#0098CE]/5">
            <div className="flex gap-3">
              <span className="text-lg shrink-0 mt-0.5">📞</span>
              <div>
                <span className="font-semibold text-white">Bonus: 20-Minute Growth Session</span>
                <span className="text-gray-400 text-sm italic"> (limited — [X] spots)</span>
                <p className="text-gray-400 mt-1 text-sm">
                  1:1 with the Precision team after the workshop. Map your pipeline play.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-white/10 my-12" />

      {/* ── CTA ── */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <a
          href="[PAYMENT_LINK_PLACEHOLDER]"
          className="inline-block w-full sm:w-auto bg-[#0098CE] hover:bg-[#0080b0] text-white font-bold text-xl px-10 py-5 rounded-xl transition-colors duration-150 shadow-lg shadow-[#0098CE]/20"
        >
          Reserve My Spot — $97
        </a>
        <p className="text-gray-600 text-sm mt-4">
          Recording provided. All registrants get the replay.
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-sm text-gray-600">
        © 2026 Precision. Questions? [EMAIL PLACEHOLDER]
      </footer>
    </div>
  )
}
