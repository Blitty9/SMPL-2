import { useScrollAnimation } from '../lib/utils/useScrollAnimation';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
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
            Terms of <span className="text-[#6D5AE0]">Service</span>
          </h1>
          <p className="text-[#A0A0A0] mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-8 text-[#ECECEC] leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Agreement to Terms</h2>
              <p className="text-[#A0A0A0] mb-4">
                By accessing or using SMPL ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Use License</h2>
              <p className="text-[#A0A0A0] mb-4">
                Permission is granted to temporarily use SMPL for personal and commercial purposes. This license does not include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#A0A0A0] ml-4">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose without explicit permission</li>
                <li>Removing any copyright or proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">User Content</h2>
              <p className="text-[#A0A0A0] mb-4">
                You retain ownership of any content you input into SMPL. By using the Service, you grant us a license to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#A0A0A0] ml-4">
                <li>Process and transform your content to generate schemas and prompts</li>
                <li>Store your content temporarily to provide the Service</li>
                <li>Use anonymized, aggregated data to improve our services</li>
              </ul>
              <p className="text-[#A0A0A0] mt-4">
                You are responsible for ensuring that your content does not violate any laws or infringe on the rights of others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Service Availability</h2>
              <p className="text-[#A0A0A0] mb-4">
                We strive to provide reliable service but do not guarantee that the Service will be available at all times. We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#A0A0A0] ml-4">
                <li>Modify or discontinue the Service at any time</li>
                <li>Limit access to the Service for maintenance or updates</li>
                <li>Restrict access for users who violate these Terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Intellectual Property</h2>
              <p className="text-[#A0A0A0] mb-4">
                The Service, including its original content, features, and functionality, is owned by SMPL and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-[#A0A0A0] mb-4">
                Generated schemas, DSL formats, and export prompts created using the Service are your property, subject to the license granted above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Disclaimer</h2>
              <p className="text-[#A0A0A0] mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#A0A0A0] ml-4">
                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Accuracy, reliability, or completeness of generated content</li>
                <li>Uninterrupted or error-free operation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Limitation of Liability</h2>
              <p className="text-[#A0A0A0] mb-4">
                IN NO EVENT SHALL SMPL, ITS AFFILIATES, OR THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#A0A0A0] ml-4">
                <li>Loss of profits, data, or use</li>
                <li>Business interruption</li>
                <li>Personal injury or property damage</li>
              </ul>
              <p className="text-[#A0A0A0] mt-4">
                This limitation applies regardless of the theory of liability, whether in contract, tort, or otherwise.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Indemnification</h2>
              <p className="text-[#A0A0A0] mb-4">
                You agree to indemnify, defend, and hold harmless SMPL and its affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#A0A0A0] ml-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Third-Party Services</h2>
              <p className="text-[#A0A0A0] mb-4">
                The Service may integrate with third-party services (such as OpenAI, Supabase, etc.). Your use of these services is subject to their respective terms of service and privacy policies. We are not responsible for the practices of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Changes to Terms</h2>
              <p className="text-[#A0A0A0] mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Governing Law</h2>
              <p className="text-[#A0A0A0] mb-4">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the appropriate courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Contact Information</h2>
              <p className="text-[#A0A0A0] mb-4">
                If you have any questions about these Terms of Service, please contact us through our website or support channels.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

