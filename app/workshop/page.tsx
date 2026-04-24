import CountdownTimer from './CountdownTimer'

// 👇 Change this to update the workshop date everywhere
const WORKSHOP_DATE = new Date('2026-05-14T13:00:00-04:00')

export default function WorkshopPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Countdown Banner ── */}
      <section className="border-b border-white/10 bg-[#0f0f0f] py-8 px-4">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-emerald-400 mb-6 uppercase">
          Live Workshop — Starts In
        </p>
        <CountdownTimer targetDate={WORKSHOP_DATE} />
      </section>

      {/* ── Hero ── */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase mb-4">
          Live Workshop
        </p>
        <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
          Kill the PDF
        </h1>
        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
          Build an interactive microsite lead magnet in 90 minutes that qualifies your best-fit buyers before the first sales call
        </p>

        {/* Matt */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
            Matt V
          </div>
          <p className="text-gray-400 text-sm max-w-sm">
            Matt Verlaque — Fireman turned founder. Exited UpLaunch for 8 figures. Coached 500+ SaaS founders to $106M ARR.
          </p>
        </div>
      </section>

      {/* ── The Case ── */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="prose prose-invert prose-lg max-w-none text-gray-400 space-y-5">
          <p>You&apos;ve shipped a PDF.</p>
          <p>
            Maybe it was a guide. A checklist. A framework with your logo on it. You emailed it to
            your list, posted it to LinkedIn, spent two hours making it look good in Canva.
          </p>
          <p>And then... nothing.</p>
          <p>
            Or worse — you got downloads. Lots of them. From people who will never, ever buy what
            you&apos;re selling.
          </p>
          <p>
            Meanwhile, your best-fit buyers are joining someone else&apos;s email list. They&apos;re
            downloading someone else&apos;s lead magnet, getting value from someone else&apos;s
            content, and booking calls with someone who figured this out before you did.
          </p>
          <p>
            Here&apos;s the problem most SaaS founders miss:{' '}
            <strong className="text-white">information is dead.</strong> The days when a PDF had
            value are gone. Your buyers don&apos;t want a template they have to edit. They don&apos;t
            want a 47-page ebook they&apos;ll never read. They want a result — right now,
            personalized to their business, with a clear path to the next step.
          </p>
          <p>
            And if your lead magnet can&apos;t deliver that? It&apos;s not a lead magnet. It&apos;s
            a free brochure.
          </p>
          <p>
            The second problem: even when you get leads, they&apos;re wrong. They download your
            thing, get some value, and then ghost. They were never going to buy. And now they&apos;re
            on your calendar — Joe&apos;s calendar — running full sales cycles on people who had no
            shot at closing. That&apos;s not a sales problem. That&apos;s a marketing architecture
            problem.
          </p>
          <p>There&apos;s a better way to build this.</p>
          <p>
            A <strong className="text-white">microsite lead magnet</strong> is a standalone,
            interactive, single-purpose website that delivers a personalized result — and qualifies
            your best-fit buyers in the process. No PDF. No ebook. No &quot;hope they call
            back.&quot; It asks your prospect the right questions, gives them something immediately
            useful, and engineers the next step before they ever get on a call.
          </p>
          <p>
            I&apos;ve tested this with hundreds of founders. The ones who get it right stop wasting
            Joe&apos;s calendar. They show up to sales calls with pipeline that&apos;s already warm,
            already qualified, already bought into the framework.
          </p>
          <p className="text-white font-semibold text-lg">
            That&apos;s what we&apos;re building together in 90 minutes.
          </p>
        </div>
      </section>

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
          <span className="font-semibold text-white">💰 $97</span>
        </div>
      </section>

      {/* ── What We'll Cover ── */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Here&apos;s what we&apos;ll cover</h2>
        <div className="space-y-6">
          {[
            {
              title: 'Why your PDF is killing your pipeline — and the 4 shifts that fix it',
              body: 'Static → interactive. Generic → personalized. Information → outcomes. "Hope it works" → deliberate sale priming. We\'ll walk the model before we build so you understand why this actually converts.',
            },
            {
              title: 'The Beacon Filter — how to grade your lead magnet idea before you build it',
              body: '5 specific filters every great lead magnet must pass: qualifying power, mind-reader specificity, desire vs. need, SAGE (Short, Actionable, Goal-oriented, Easy), and primal driver. We\'ll run your idea through the filter live.',
            },
            {
              title: 'The Format Match Matrix — pick the right format for the win you want to deliver',
              body: 'Calculator, quiz, prompt pack, plan builder, or template generator — the wrong format kills an otherwise great idea. We\'ll match yours before you touch the build tool.',
            },
            {
              title: 'The 3 Laws of magnetic lead magnets',
              body: 'Quick win only. Clear next step. Format matches the win. If you nail these three, the rest takes care of itself.',
            },
            {
              title: 'Live build inside Manus ($20/month) — no designer, no developer, no code',
              body: 'You\'ll build your microsite on this call. Not a wireframe. Not a prototype. A functional, shippable lead magnet ready to go live the same day.',
            },
            {
              title: 'The qualification architecture — how to filter out bad-fit buyers before the first sales call',
              body: 'The questions you ask inside your microsite are the difference between a pipeline of serious buyers and a calendar full of time-wasters.',
            },
          ].map(({ title, body }, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-emerald-400 font-bold text-lg mt-0.5 shrink-0">{i + 1}.</span>
              <div>
                <p className="font-semibold text-white mb-1">{title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What You Walk Away With ── */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-white mb-4">What You Walk Away With</h2>
        <p className="text-gray-400 mb-8">
          This isn&apos;t a lecture. You&apos;re building something live on this call.
        </p>
        <p className="text-gray-300 mb-8">By the end of 90 minutes you&apos;ll have:</p>

        <div className="space-y-5">
          {[
            {
              icon: '✅',
              title: 'A live, published microsite lead magnet',
              body: "You'll run through the Magnetic Microsite Generator's 5-stage AI interview, get a complete spec document — real copy, real questions, real scoring logic — paste it into Manus, and ship. Not a wireframe. The actual thing, live on the internet before the call ends.",
            },
            {
              icon: '✅',
              title: 'The Beacon Filter (built into the tool)',
              body: "Every problem you bring gets scored across 5 gates. Only your highest-qualifying pain point becomes your lead magnet topic. You'll use this framework on every idea going forward.",
            },
            {
              icon: '✅',
              title: 'The Format Match Matrix',
              body: 'Know exactly which format (calculator, quiz, prompt pack, plan builder, template generator) fits any offer or audience.',
            },
            {
              icon: '✅',
              title: 'The 3 Laws of magnetic lead magnets',
              body: 'The framework behind every lead magnet that actually generates pipeline vs. the ones that collect dust.',
            },
            {
              icon: '✅',
              title: 'A clear next step wired into your microsite',
              body: 'Your microsite will have a CTA that moves qualified buyers into your pipeline. Not back to your website. Into your sales process.',
            },
          ].map(({ icon, title, body }, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-lg shrink-0 mt-0.5">{icon}</span>
              <div>
                <span className="font-semibold text-white">{title}</span>
                <span className="text-gray-400"> — {body}</span>
              </div>
            </div>
          ))}

          {/* Bonus */}
          <div className="mt-8 border border-emerald-500/30 rounded-lg p-5 bg-emerald-500/5">
            <div className="flex gap-3">
              <span className="text-lg shrink-0 mt-0.5">📞</span>
              <div>
                <span className="font-semibold text-white">Bonus: 20-Minute Growth Session</span>
                <span className="text-gray-400 text-sm italic"> (limited — [X] spots)</span>
                <p className="text-gray-400 mt-1 text-sm">
                  1:1 time with the Precision team after the workshop to map your pipeline play.
                  First come, first served.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <a
          href="[PAYMENT_LINK_PLACEHOLDER]"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xl px-10 py-5 rounded-xl transition-colors duration-150 shadow-lg shadow-emerald-500/20"
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
