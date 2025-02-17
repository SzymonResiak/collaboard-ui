import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <textarea
          className={cn(
            'flex h-[120px] w-full rounded-md border border-gray-300 bg-transparent',
            'px-3 py-2 text-sm placeholder:text-gray-400',
            'focus:outline-none focus:ring-1 focus:ring-black focus:border-black',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent',
            error && 'border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
