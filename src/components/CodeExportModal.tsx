import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { UIElement } from '../types/element';
import { exportToReactCode } from '../utils/elementUtils';

interface CodeExportModalProps {
  elements: UIElement[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeExportModal({ elements, isOpen, onClose }: CodeExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const code = `import React from 'react';

export default function GeneratedComponent() {
  return (
${exportToReactCode(elements, 2)}
  );
}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252525] text-gray-300 rounded-lg shadow-xl w-[800px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2d2d2d]">
          <h2 className="text-sm font-semibold">Export React Code</h2>
          <button
            onClick={onClose}
            className="p-0.5 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-3">
          <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>

        <div className="px-4 py-2.5 border-t border-[#2d2d2d] flex justify-end gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            {copied ? (
              <>
                <Check size={12} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

