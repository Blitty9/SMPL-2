import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import DotBlueprintBackground from '../components/landing/DotBlueprintBackground';
import { ProductHero } from '../components/product/ProductHero';
import { WhatSMPLSolves } from '../components/product/WhatSMPLSolves';
import { CoreFeatures } from '../components/product/CoreFeatures';
import { ExampleTransformation } from '../components/product/ExampleTransformation';
import { SupportedBuilders } from '../components/product/SupportedBuilders';
import { TokenSavings } from '../components/product/TokenSavings';
import { ProductCTA } from '../components/product/ProductCTA';
import { useScrollAnimation } from '../lib/utils/useScrollAnimation';

export default function ProductPage() {
  const navigate = useNavigate();
  const containerRef = useScrollAnimation();

  const handleLaunchEditor = () => {
    navigate('/editor');
  };

  return (
    <div ref={containerRef} className="product-page relative min-h-screen bg-deep-black">
      <DotBlueprintBackground />
      <div className="relative z-10">
        <Navbar onLaunchEditor={handleLaunchEditor} />

        <section className="relative z-20 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <ProductHero />
        </section>

        <section className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '100ms' }}>
          <WhatSMPLSolves />
        </section>

        <section className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '200ms' }}>
          <CoreFeatures />
        </section>

        <section className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '100ms' }}>
          <ExampleTransformation />
        </section>

        <section className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '100ms' }}>
          <SupportedBuilders />
        </section>

        <section className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '100ms' }}>
          <TokenSavings />
        </section>

        <section className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: '100ms' }}>
          <ProductCTA onGetStarted={handleLaunchEditor} />
        </section>

        <Footer />
      </div>
    </div>
  );
}
