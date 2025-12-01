export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      shape: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M2 2L22 2L22 22L2 22Z" stroke="#C7B8FF" strokeWidth="1.5" fill="none" />
          <line x1="6" y1="8" x2="18" y2="8" stroke="#C7B8FF" strokeWidth="0.5" opacity="0.5" />
          <line x1="6" y1="12" x2="18" y2="12" stroke="#C7B8FF" strokeWidth="0.5" opacity="0.5" />
        </svg>
      ),
      title: 'Describe Your Project',
      description: 'Write a natural language description of what you want to build.',
    },
    {
      number: '02',
      shape: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#C7B8FF" strokeWidth="1.5" />
          <line x1="12" y1="4" x2="12" y2="20" stroke="#D4C5FF" strokeWidth="0.5" opacity="0.6" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="#D4C5FF" strokeWidth="0.5" opacity="0.6" />
        </svg>
      ),
      title: 'Generate Blueprint',
      description: 'SMPL transforms your input into structured, machine-readable formats.',
    },
    {
      number: '03',
      shape: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L22 12L12 22L2 12Z" stroke="#C7B8FF" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="3" fill="#D4C5FF" opacity="0.6" />
        </svg>
      ),
      title: 'Export & Build',
      description: 'Use the output with AI agents, dev tools, or documentation systems.',
    },
  ];

  return (
    <section className="hiw-container py-16 bg-surface-gray/30">
      <div className="container mx-auto px-8">
        <div className="text-center mb-10 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <h2 className="hiw-title text-3xl md:text-4xl font-semibold tracking-tight mb-3 leading-tight">
            How It Works
          </h2>
          <p className="hiw-subtitle text-sm text-graphite-gray leading-[1.45]">
            Three simple steps from idea to structured blueprint
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <svg className="absolute top-[65px] left-0 w-full h-[2px] z-0" xmlns="http://www.w3.org/2000/svg">
            <line x1="22%" y1="1" x2="78%" y2="1" stroke="#6D5AE0" strokeWidth="2" strokeDasharray="6 6" opacity="0.3" />
          </svg>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="hiw-step text-center scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: `${(index + 1) * 100}ms` }}>
                <div className="hiw-step-number text-xs font-mono text-[#6D5AE0] mb-2 font-semibold">
                  {step.number}
                </div>
                <div className="hiw-step-shape flex justify-center mb-3 bg-surface-gray/30 w-fit mx-auto p-4 rounded-lg border border-[#2F333A]">
                  {step.shape}
                </div>
                <h3 className="hiw-step-title text-sm font-bold mb-1.5 leading-tight">{step.title}</h3>
                <p className="hiw-step-description text-xs text-graphite-gray max-w-[170px] mx-auto leading-[1.35]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
