import ModeToggle, { EditorMode, AITool } from './ModeToggle';

interface IdeaInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  aiTool: AITool;
  onAIToolChange: (tool: AITool) => void;
}

export default function IdeaInput({ value, onChange, onGenerate, isGenerating, mode, onModeChange, aiTool, onAIToolChange }: IdeaInputProps) {
  const placeholder = mode === 'app'
    ? "Example: I want to build a mobile journal app where users can write daily entries, attach photos, and set mood tags. It should have a calendar view and search functionality."
    : "Example: Create a responsive dashboard with real-time data visualization. The dashboard should display user analytics, include filterable charts, and support dark mode.";

  const heading = mode === 'app' ? 'Describe your app' : 'Describe your prompt';

  return (
    <div className="flex flex-col h-full p-8">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-[#ECECEC] mb-2">
          {heading}
        </h2>
        <div className="h-0.5 w-16 bg-[#6D5AE0]" />
      </div>

      <ModeToggle mode={mode} onChange={onModeChange} aiTool={aiTool} onAIToolChange={onAIToolChange} />

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 w-full bg-[#111215] border border-[#2F333A] rounded-md p-4 text-[#ECECEC] font-mono text-sm resize-none focus:outline-none focus:border-[#6D5AE0] transition-colors"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      />

      <div className="mt-6 flex gap-3">
        <button
          onClick={onGenerate}
          disabled={!value.trim() || isGenerating}
          className="flex-1 bg-[#6D5AE0] text-white font-medium py-3 px-6 rounded-md hover:bg-[#7a68e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : mode === 'app' ? 'Generate Schema' : 'Generate Prompt'}
        </button>
      </div>
    </div>
  );
}
