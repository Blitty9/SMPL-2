import { MessageSquare } from 'lucide-react';

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 h-[44px]">
        <MessageSquare className="w-5 h-5 text-soft-lavender" />
        <h2 className="text-lg font-semibold">Your Messy Idea</h2>
      </div>

      <div className="flex-1 bg-surface-gray rounded-2xl border border-border-gray shadow-xl shadow-black/25 overflow-hidden">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your app idea here... Don't worry about structure or clarity. Just brain dump everything."
          className="w-full h-full bg-transparent text-off-white placeholder-graphite-gray resize-none outline-none focus:ring-0 text-base leading-relaxed p-6"
          spellCheck={false}
        />
      </div>

      <div className="mt-6 text-sm text-graphite-gray h-[20px]">
        Tip: Include features, user flows, tech stack, or any random thoughts
      </div>
    </div>
  );
}
