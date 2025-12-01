import { useState } from 'react';
import { X, Copy, Check, ArrowRight } from 'lucide-react';
import type { Example } from '../../data/examples';

interface ExampleModalProps {
  example: Example;
  isOpen: boolean;
  onClose: () => void;
  onLoadExample: () => void;
}

type TabType = 'natural' | 'json' | 'smpl';

export default function ExampleModal({ example, isOpen, onClose, onLoadExample }: ExampleModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('natural');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string }[] = [
    { id: 'natural', label: 'Natural Language' },
    { id: 'json', label: 'JSON Schema' },
    { id: 'smpl', label: 'SMPL Format' },
  ];

  const getContent = () => {
    switch (activeTab) {
      case 'natural':
        return example.natural;
      case 'json':
        return JSON.stringify(example.json, null, 2);
      case 'smpl':
        return example.smpl;
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadExample = () => {
    onLoadExample();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0C0D10] border border-[#2F333A] rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#2F333A]">
          <div>
            <h2 className="text-2xl font-semibold text-[#ECECEC]">{example.title}</h2>
            <p className="text-sm text-[#A0A0A0] mt-1">{example.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#A0A0A0] hover:text-[#ECECEC] hover:bg-[#1A1B1F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2F333A]">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-1 font-mono text-sm transition-colors relative ${
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

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1B1F] border border-[#2F333A] text-[#A0A0A0] hover:text-[#ECECEC] hover:border-[#6D5AE0]/50 transition-all duration-200 text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="bg-[#111215] border border-[#2F333A] rounded-lg p-6">
            <pre className="text-sm text-[#ECECEC] leading-relaxed font-mono overflow-x-auto">
              {getContent()}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#2F333A]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#1A1B1F] border border-[#2F333A] text-[#A0A0A0] hover:text-[#ECECEC] hover:border-[#6D5AE0]/50 transition-all duration-200 text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={handleLoadExample}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6D5AE0] text-white hover:bg-[#5A48C7] transition-all duration-200 text-sm font-medium"
          >
            Load into Editor
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
