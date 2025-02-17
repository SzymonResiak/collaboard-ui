'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CopyToClipboardProps {
  value: string;
  children: React.ReactNode;
}

export function CopyToClipboard({ value, children }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-1 hover:text-gray-700 transition-colors"
    >
      {children}
      {copied ? (
        <Check className="w-3 h-3 group-hover:opacity-100" />
      ) : (
        <Copy className="w-3 h-3 group-hover:opacity-100" />
      )}
    </button>
  );
}
