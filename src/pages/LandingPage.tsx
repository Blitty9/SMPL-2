import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import { Hero as AnimatedHero } from '../components/ui/animated-hero';
import HowItWorks from '../components/landing/HowItWorks';
import CodePreview from '../components/landing/CodePreview';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import DotBlueprintBackground from '../components/landing/DotBlueprintBackground';
import { FeaturesSectionWithHoverEffects } from '../components/blocks/feature-section-with-hover-effects';
import { useScrollAnimation } from '../lib/utils/useScrollAnimation';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useScrollAnimation();

  const handleLaunchEditor = () => {
    navigate('/editor');
  };

  return (
    <div ref={containerRef} className="landing-page relative min-h-screen bg-deep-black">
      <DotBlueprintBackground />
      <div className="relative z-10">
        <Navbar onLaunchEditor={handleLaunchEditor} />
        <section className="relative z-20 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <AnimatedHero />
        </section>
        <section className="relative scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '100ms' }}>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-deep-black via-deep-black/50 to-transparent pointer-events-none" />
          <div className="pt-8">
            <FeaturesSectionWithHoverEffects />
          </div>
        </section>
        <section className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '200ms' }}>
          <HowItWorks />
        </section>
        <section className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '300ms' }}>
          <CodePreview />
        </section>
        <CTASection onLaunchEditor={handleLaunchEditor} />
        <section className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '500ms' }}>
          <Footer />
        </section>
      </div>
    </div>
  );
}
