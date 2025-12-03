import { cn } from '../../lib/utils/cn';
import AIToolSelector from './AIToolSelector';

export type EditorMode = 'app' | 'prompt';
export type AITool = 'cursor' | 'claude' | 'bolt' | 'v0' | 'replit' | 'openai' | 'anthropic' | 'createanything' | 'lovable';

interface ModeToggleProps {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
  aiTool: AITool;
  onAIToolChange: (tool: AITool) => void;
}

export default function ModeToggle({ mode, onChange, aiTool, onAIToolChange }: ModeToggleProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <div className="inline-flex rounded-lg border border-[#2F333A] bg-[#111215] p-1">
        <button
          onClick={() => onChange('app')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            mode === 'app'
              ? 'bg-[#6D5AE0] text-white'
              : 'text-[#A0A0A0] hover:text-[#ECECEC]'
          )}
        >
          App Mode
        </button>
        <button
          onClick={() => onChange('prompt')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            mode === 'prompt'
              ? 'bg-[#6D5AE0] text-white'
              : 'text-[#A0A0A0] hover:text-[#ECECEC]'
          )}
        >
          Prompt Mode
        </button>
        </div>
        <AIToolSelector value={aiTool} onChange={onAIToolChange} />
      </div>
      <div className="mt-3 p-3 rounded-md bg-[#111215] border border-[#2F333A]">
        {mode === 'app' ? (
          <div>
            <p className="text-xs font-medium text-[#ECECEC] mb-1">App Mode</p>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              For building full applications. Generates structured schemas (pages, models, actions) and tool-specific implementation prompts to build your app.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-medium text-[#ECECEC] mb-1">Prompt Mode</p>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              For optimizing individual tasks/prompts. Structures and compresses prompts, generates tool-specific versions, and provides token analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
