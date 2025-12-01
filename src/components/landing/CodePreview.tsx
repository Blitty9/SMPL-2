import { useState } from 'react';

export default function CodePreview() {
  const [activeFormat, setActiveFormat] = useState<'json' | 'smpl'>('json');

  const jsonCode = `{
  "project": "task-manager",
  "features": [
    "user-authentication",
    "task-crud",
    "real-time-updates"
  ],
  "stack": {
    "frontend": "react",
    "backend": "node",
    "database": "postgres"
  }
}`;

  const smplCode = `project task-manager {
  features: [
    auth,
    tasks,
    realtime
  ]

  stack: [
    react,
    node,
    postgres
  ]
}`;

  return (
    <section className="code-preview-container py-20 bg-deep-black relative">
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] z-0" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="200" stroke="#2F333A" strokeWidth="0.5" fill="none" opacity="0.3" />
        <circle cx="250" cy="250" r="150" stroke="#2F333A" strokeWidth="0.5" fill="none" opacity="0.2" />
        <line x1="50" y1="250" x2="450" y2="250" stroke="#2F333A" strokeWidth="0.5" opacity="0.2" />
        <line x1="250" y1="50" x2="250" y2="450" stroke="#2F333A" strokeWidth="0.5" opacity="0.2" />
      </svg>

      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center mb-12 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <h2 className="code-preview-title text-3xl md:text-4xl font-semibold tracking-tight mb-3 leading-tight">
            Clean, Structured Output
          </h2>
          <p className="code-preview-subtitle text-sm text-graphite-gray max-w-xl mx-auto leading-[1.45]">
            From human intent to machine-readable blueprints
          </p>
        </div>

        <div className="max-w-4xl mx-auto scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '100ms' }}>
          <div className="flex items-center justify-center gap-0 mb-6">
            <button
              onClick={() => setActiveFormat('json')}
              className={`px-8 py-2.5 text-sm font-mono font-medium transition-colors duration-200 ${
                activeFormat === 'json'
                  ? 'bg-[#6D5AE0] text-white'
                  : 'bg-transparent text-graphite-gray hover:text-white'
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setActiveFormat('smpl')}
              className={`px-8 py-2.5 text-sm font-mono font-medium transition-colors duration-200 ${
                activeFormat === 'smpl'
                  ? 'bg-[#6D5AE0] text-white'
                  : 'bg-transparent text-graphite-gray hover:text-white'
              }`}
            >
              SMPL
            </button>
          </div>

          <div className="code-block-wrapper rounded-lg border border-[#2F333A] bg-surface-gray/50 overflow-hidden border-l-[3px] border-l-[#6D5AE0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            <div className="code-block-header px-6 py-4 border-b border-[#2F333A] flex items-center justify-between">
              <span className="text-xs font-mono text-graphite-gray">
                {activeFormat === 'json' ? 'blueprint.json' : 'blueprint.smpl'}
              </span>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2F333A]"></div>
                <div className="w-3 h-3 rounded-full bg-[#2F333A]"></div>
                <div className="w-3 h-3 rounded-full bg-[#2F333A]"></div>
              </div>
            </div>
            <div className="code-block-content p-8">
              <pre className="text-[15px] leading-[1.7] font-mono">
                <code className="code-line-group text-off-white">
                  {activeFormat === 'json' ? jsonCode : smplCode}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
