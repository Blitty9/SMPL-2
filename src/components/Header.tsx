import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function Header({ onGenerate, isGenerating }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#2F333A] bg-deep-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blueprint-purple to-soft-lavender flex items-center justify-center shadow-lg shadow-blueprint-purple/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-semibold tracking-tight leading-none">SMPL</h1>
            <p className="text-sm text-graphite-gray mt-0.5">AI-Ready Blueprints</p>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blueprint-purple to-soft-lavender text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blueprint-purple/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {isGenerating ? 'Generating...' : 'Generate Blueprint'}
        </button>
      </div>
    </header>
  );
}
