import { useState, useRef, useEffect } from 'react';
import { Copy, Check, FileJson, Code2, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OutputPanelProps {
  jsonOutput: string;
  smplOutput: string;
  expandedOutput: string;
}

type TabType = 'json' | 'smpl' | 'expanded' | 'export';

export default function OutputPanel({ jsonOutput, smplOutput, expandedOutput }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('json');
  const [copied, setCopied] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const tabs = [
    { id: 'json' as const, label: 'JSON', icon: FileJson },
    { id: 'smpl' as const, label: 'SMPL', icon: Code2 },
    { id: 'expanded' as const, label: 'Expanded', icon: FileText },
    { id: 'export' as const, label: 'Export', icon: Download },
  ];

  useEffect(() => {
    const activeTabElement = tabsRef.current[activeTab];
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  const getContent = () => {
    switch (activeTab) {
      case 'json':
        return jsonOutput || '// Your structured JSON blueprint will appear here';
      case 'smpl':
        return smplOutput || '// Your SMPL Format representation will appear here';
      case 'expanded':
        return expandedOutput || '// Your expanded blueprint will appear here';
      case 'export':
        return '// Export options will appear here';
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 h-[44px]">
        <div className="relative flex items-center gap-1 bg-surface-gray rounded-xl p-1 border border-border-gray">
          <motion.div
            className="absolute bottom-0 h-[2px] bg-[#C7B8FF] rounded-full"
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{
              duration: 0.25,
              ease: [0.33, 1, 0.68, 1],
            }}
          />
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                ref={(el) => (tabsRef.current[tab.id] = el)}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-graphite-gray hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-gray border border-border-gray text-graphite-gray hover:text-white hover:border-soft-lavender/50 transition-all duration-150"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 bg-surface-gray rounded-2xl border border-border-gray shadow-xl shadow-black/25 overflow-hidden">
        <div className="h-full overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: 0.22,
                ease: [0.33, 1, 0.68, 1],
              }}
            >
              <pre className="text-sm text-off-white leading-relaxed">
                <code>{getContent()}</code>
              </pre>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 h-[20px]" />
    </div>
  );
}
