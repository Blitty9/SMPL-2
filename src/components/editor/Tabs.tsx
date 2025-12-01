import type { EditorMode } from './ModeToggle';

type TabType = 'json' | 'dsl' | 'expanded' | 'exports' | 'analysis';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  mode: EditorMode;
}

const appTabs: { id: TabType; label: string }[] = [
  { id: 'json', label: 'JSON Schema' },
  { id: 'dsl', label: 'SMPL DSL' },
  { id: 'expanded', label: 'Expanded Spec' },
  { id: 'exports', label: 'Export Prompts' },
];

const promptTabs: { id: TabType; label: string }[] = [
  { id: 'json', label: 'JSON' },
  { id: 'dsl', label: 'Compact' },
  { id: 'expanded', label: 'Expanded' },
  { id: 'analysis', label: 'Tokens' },
  { id: 'exports', label: 'Exports' },
];

export default function Tabs({ activeTab, onTabChange, mode }: TabsProps) {
  const tabs = mode === 'app' ? appTabs : promptTabs;

  return (
    <div className="flex space-x-8 border-b border-[#2F333A] overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 font-mono text-sm transition-colors relative whitespace-nowrap ${
            activeTab === tab.id
              ? 'text-[#ECECEC]'
              : 'text-[#A0A0A0] hover:text-[#ECECEC]'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D5AE0]" />
          )}
        </button>
      ))}
    </div>
  );
}
