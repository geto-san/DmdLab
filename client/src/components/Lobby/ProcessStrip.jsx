const steps = [
  {
    step: '01',
    title: 'We identify a real problem',
    description: 'Student researchers scope challenges alongside the communities and users they affect — from park rangers to the Deaf community.',
  },
  {
    step: '02',
    title: 'We build and test in the open',
    description: 'Applied ML models, prototypes, and field tools are developed, documented, and shared as research progresses.',
  },
  {
    step: '03',
    title: 'We publish and hand it off',
    description: 'Findings become articles and videos here — reproducible, cited, and ready for the next researcher to build on.',
  },
];

const ProcessStrip = () => (
  <section className="bg-paper">
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="max-w-xl mb-12">
        <span className="eyebrow text-signal">How the lab works</span>
        <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink-text mt-3">
          From open question to published research
        </h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 sm:gap-5">
        {steps.map((item, index) => (
          <div key={item.step} className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display font-semibold text-3xl text-ink-text/15">
                {item.step}
              </span>
              {index < steps.length - 1 && (
                <span className="hidden sm:block h-px flex-1 bg-black/10" />
              )}
            </div>
            <h3 className="font-display font-semibold text-lg text-ink-text mb-2">
              {item.title}
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessStrip;
