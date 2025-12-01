import { useScrollAnimation } from '../lib/utils/useScrollAnimation';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();
  const containerRef = useScrollAnimation();

  const handleLaunchEditor = () => {
    navigate('/editor');
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-deep-black text-[#ECECEC]">
      <Navbar onLaunchEditor={handleLaunchEditor} />
      
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy <span className="text-[#6D5AE0]">Policy</span>
          </h1>
          <p className="text-[#A0A0A0] mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-8 text-[#ECECEC] leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Introduction</h2>
              <p className="text-[#A0A0A0] mb-4">
                SMPL ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Information We Collect</h2>
              <div className="space-y-4 text-[#A0A0A0]">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Information You Provide</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Application descriptions and prompts you input into the editor</li>
                    <li>Generated schemas, DSL formats, and export prompts</li>
                    <li>Any feedback or communications you send to us</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Usage data and interaction patterns with our application</li>
                    <li>Technical information such as browser type, device information, and IP address</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-[#A0A0A0] ml-4">
                <li>To provide, maintain, and improve our services</li>
                <li>To process and generate application schemas and prompts</li>
                <li>To analyze usage patterns and improve user experience</li>
                <li>To communicate with you about our services</li>
                <li>To comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Data Storage and Security</h2>
              <p className="text-[#A0A0A0] mb-4">
                We use Supabase for data storage and processing. Your data is stored securely and encrypted in transit and at rest. We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Third-Party Services</h2>
              <p className="text-[#A0A0A0] mb-4">
                Our service integrates with third-party services including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#A0A0A0] ml-4">
                <li><strong>OpenAI:</strong> For AI-powered schema generation and prompt processing</li>
                <li><strong>Supabase:</strong> For backend infrastructure, database, and edge functions</li>
              </ul>
              <p className="text-[#A0A0A0] mt-4">
                These services have their own privacy policies governing the use of your information. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Data Retention</h2>
              <p className="text-[#A0A0A0] mb-4">
                We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Your Rights</h2>
              <p className="text-[#A0A0A0] mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-[#A0A0A0] ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Children's Privacy</h2>
              <p className="text-[#A0A0A0] mb-4">
                Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Changes to This Privacy Policy</h2>
              <p className="text-[#A0A0A0] mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
              <p className="text-[#A0A0A0] mb-4">
                If you have any questions about this Privacy Policy, please contact us through our website or support channels.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

