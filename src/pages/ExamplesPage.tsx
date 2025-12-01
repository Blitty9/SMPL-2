import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import ExampleCard from '../components/examples/ExampleCard';
import ExampleModal from '../components/examples/ExampleModal';
import { examples } from '../data/examples';
import type { Example } from '../data/examples';
import { useScrollAnimation } from '../lib/utils/useScrollAnimation';

export default function ExamplesPage() {
  const navigate = useNavigate();
  const containerRef = useScrollAnimation();
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (example: Example) => {
    setSelectedExample(example);
    setIsModalOpen(true);
  };

  const handleLoadExample = (example: Example) => {
    navigate('/editor', { state: { example } });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0C0D10] text-[#ECECEC]">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="blueprint-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#2F333A"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
      </svg>

      <div className="relative z-10">
        <div className="container mx-auto px-8 py-16">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-[#111215] border border-[#2F333A] text-[#ECECEC] hover:border-[#6D5AE0] hover:bg-[#6D5AE0]/10 transition-colors duration-200"
              title="Back to Homepage"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
          </div>
          <div className="mb-12 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Examples
            </h1>
            <p className="text-[#A0A0A0] text-lg max-w-2xl">
              Starter blueprints you can load instantly. Explore pre-built schemas and customize them for your projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <div key={example.id} className="scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ transitionDelay: `${(index % 3) * 100}ms` }}>
                <ExampleCard
                  example={example}
                  onViewDetails={() => handleViewDetails(example)}
                  onLoadExample={() => handleLoadExample(example)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedExample && (
        <ExampleModal
          example={selectedExample}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExample(null);
          }}
          onLoadExample={() => handleLoadExample(selectedExample)}
        />
      )}
    </div>
  );
}
