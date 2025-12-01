import { Eye, ArrowRight } from 'lucide-react';
import type { Example } from '../../data/examples';

interface ExampleCardProps {
  example: Example;
  onViewDetails: () => void;
  onLoadExample: () => void;
}

export default function ExampleCard({ example, onViewDetails, onLoadExample }: ExampleCardProps) {
  return (
    <div className="group relative bg-[#111215] border border-[#2F333A] rounded-xl p-6 hover:border-[#6D5AE0] transition-all duration-300 hover:shadow-[0_0_20px_rgba(109,90,224,0.15)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6D5AE0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-[#ECECEC] mb-2 group-hover:text-[#C7B8FF] transition-colors">
          {example.title}
        </h3>

        <p className="text-[#A0A0A0] text-sm leading-relaxed mb-6">
          {example.description}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onViewDetails}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A1B1F] border border-[#2F333A] text-[#A0A0A0] hover:text-[#ECECEC] hover:border-[#6D5AE0]/50 transition-all duration-200 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          <button
            onClick={onLoadExample}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6D5AE0] text-white hover:bg-[#5A48C7] transition-all duration-200 text-sm font-medium"
          >
            Load Example
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
