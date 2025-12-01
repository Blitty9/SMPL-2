import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeOutputProps {
  content: string;
  hasContent: boolean;
}

export default function CodeOutput({ content, hasContent }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="h-full bg-[#0F1013] border border-[#2F333A] rounded-md overflow-hidden flex flex-col">
      {hasContent && (
        <div className="flex justify-end p-3 border-b border-[#2F333A]">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 text-[#A0A0A0] hover:text-[#ECECEC] transition-colors text-sm"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {hasContent ? (
          <pre className="p-6 text-sm font-mono text-[#ECECEC] leading-relaxed whitespace-pre-wrap">
            {content}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full text-[#A0A0A0] text-sm">
            Generate a schema to see output
          </div>
        )}
      </div>
    </div>
  );
}
