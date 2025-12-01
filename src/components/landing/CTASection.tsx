interface CTASectionProps {
  onLaunchEditor: () => void;
}

export default function CTASection({ onLaunchEditor }: CTASectionProps) {
  return (
    <section className="cta-section-container py-14 bg-surface-gray/30">
      <div className="container mx-auto px-8 text-center">
        <div className="cta-divider max-w-2xl mx-auto mb-10 flex items-center justify-center gap-4">
          <div className="h-[1px] w-24 bg-[#2F333A]"></div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6D5AE0] opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-[#6D5AE0] opacity-40"></div>
            <div className="w-2 h-2 rounded-full bg-[#6D5AE0] opacity-60"></div>
          </div>
          <div className="h-[1px] w-24 bg-[#2F333A]"></div>
        </div>

        <div className="cta-content max-w-2xl mx-auto">
          <h2 className="cta-title text-2xl md:text-3xl font-semibold tracking-tight mb-3 leading-tight">
            Ready to Start Building?
          </h2>
          <p className="cta-subtitle text-sm text-graphite-gray mb-6 leading-[1.45]">
            Transform your project ideas into structured blueprints in seconds
          </p>
          <button
            onClick={onLaunchEditor}
            className="cta-button px-6 py-3 rounded-md bg-white text-deep-black text-sm font-medium hover:bg-[#C7B8FF] hover:text-white transition-colors duration-200"
          >
            Launch Editor
          </button>
        </div>
      </div>
    </section>
  );
}
