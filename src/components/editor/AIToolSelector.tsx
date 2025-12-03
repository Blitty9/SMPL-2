import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Zap, Box, Code, Brain, Cpu, Smartphone, Rocket } from 'lucide-react';
import * as SelectPrimitive from '@radix-ui/react-select';
import type { AITool } from './ModeToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface AIToolSelectorProps {
  value: AITool;
  onChange: (tool: AITool) => void;
}

interface ToolOption {
  value: AITool;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const toolOptions: ToolOption[] = [
  {
    value: 'cursor',
    label: 'Cursor',
    description: 'AI-powered code editor',
    icon: Code,
  },
  {
    value: 'claude',
    label: 'Claude',
    description: 'Anthropic AI assistant',
    icon: MessageSquare,
  },
  {
    value: 'bolt',
    label: 'Bolt',
    description: 'Full-stack web builder',
    icon: Zap,
  },
  {
    value: 'v0',
    label: 'v0',
    description: 'Vercel UI generator',
    icon: Sparkles,
  },
  {
    value: 'replit',
    label: 'Replit',
    description: 'Collaborative IDE agent',
    icon: Box,
  },
  {
    value: 'openai',
    label: 'OpenAI',
    description: 'ChatGPT & GPT models',
    icon: Brain,
  },
  {
    value: 'anthropic',
    label: 'Anthropic',
    description: 'Claude API access',
    icon: Cpu,
  },
  {
    value: 'createanything',
    label: 'Create Anything',
    description: 'Turn words into mobile apps & sites',
    icon: Smartphone,
  },
  {
    value: 'lovable',
    label: 'Lovable',
    description: 'AI-powered app builder',
    icon: Rocket,
  },
];

export default function AIToolSelector({ value, onChange }: AIToolSelectorProps) {
  const selectedTool = toolOptions.find((tool) => tool.value === value);
  const SelectedIcon = selectedTool?.icon || Code;

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-[#A0A0A0] whitespace-nowrap">AI Target:</label>
      <Select value={value} onValueChange={(val) => onChange(val as AITool)}>
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center gap-2">
            <SelectedIcon className="w-4 h-4 text-[#6D5AE0]" />
            <SelectValue placeholder="Select AI tool">
              {selectedTool?.label}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="w-[280px]">
          {toolOptions.map((tool) => {
            const Icon = tool.icon;
            const isSelected = tool.value === value;
            return (
              <SelectItem 
                key={tool.value} 
                value={tool.value} 
                textValue={tool.label}
                className={isSelected ? "bg-[#6D5AE0]/30 border-l-2 border-[#6D5AE0]" : ""}
              >
                <motion.div
                  className="flex items-start gap-3 py-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="w-4 h-4 mt-0.5 text-[#6D5AE0] flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium text-[#ECECEC]">{tool.label}</span>
                    <span className="text-xs text-[#A0A0A0] leading-tight">
                      {tool.description}
                    </span>
                  </div>
                </motion.div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
