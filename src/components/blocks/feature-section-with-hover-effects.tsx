import React, { useState } from 'react';
import {
  IconCode,
  IconBrandTypescript,
  IconBrandReact,
  IconDatabase,
  IconApi,
  IconBolt,
} from '@tabler/icons-react';
import { cn } from '../../lib/utils/cn';

export const FeaturesSectionWithHoverEffects = () => {
  const features = [
    {
      title: 'TypeScript First',
      description:
        'Built with TypeScript for type safety and better developer experience. Catch errors before they happen.',
      icon: <IconBrandTypescript />,
    },
    {
      title: 'React Components',
      description:
        'Modern React architecture with hooks, context, and best practices. Reusable and maintainable.',
      icon: <IconBrandReact />,
    },
    {
      title: 'Schema Generation',
      description:
        'Transform natural language into structured schemas. AI-powered generation with multiple output formats.',
      icon: <IconCode />,
    },
    {
      title: 'Database Integration',
      description:
        'Seamless Supabase integration with RLS policies and migrations. Production-ready data layer.',
      icon: <IconDatabase />,
    },
    {
      title: 'Edge Functions',
      description:
        'Serverless edge functions for schema generation and DSL conversion. Fast and scalable.',
      icon: <IconApi />,
    },
    {
      title: 'Lightning Fast',
      description:
        'Built with Vite for instant HMR and optimized builds. Smooth developer experience.',
      icon: <IconBolt />,
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full bg-neutral-900 py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Built for Modern Development
          </h2>
          <p className="text-[#ABABAB] text-lg max-w-2xl mx-auto">
            Production-ready architecture with the latest web technologies and best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={cn(
                  'relative h-full p-6 rounded-xl bg-neutral-800 border border-neutral-800 transition-all duration-300',
                  hoveredIndex === idx &&
                    'bg-neutral-800/80 border-[#C7B8FF]/20 shadow-lg shadow-[#C7B8FF]/10'
                )}
              >
                <div
                  className={cn(
                    'absolute left-0 top-6 bottom-6 w-1 bg-transparent transition-all duration-300 rounded-r-full',
                    hoveredIndex === idx && 'bg-[#C7B8FF]'
                  )}
                />

                <div className="relative z-10">
                  <div
                    className={cn(
                      'inline-flex p-3 rounded-lg bg-neutral-900 border border-neutral-800 mb-4 transition-all duration-300',
                      hoveredIndex === idx &&
                        'bg-[#C7B8FF]/10 border-[#C7B8FF]/30'
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 text-[#ABABAB] transition-colors duration-300',
                        hoveredIndex === idx && 'text-[#C7B8FF]'
                      )}
                    >
                      {feature.icon}
                    </div>
                  </div>

                  <h3
                    className={cn(
                      'text-xl font-semibold mb-2 transition-colors duration-300',
                      hoveredIndex === idx ? 'text-white' : 'text-[#ECECEC]'
                    )}
                  >
                    {feature.title}
                  </h3>

                  <p className="text-[#ABABAB] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
