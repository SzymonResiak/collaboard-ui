import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  autoFocus?: boolean;
}

export function Input({
  label,
  error,
  className,
  autoFocus = false,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        autoFocus={autoFocus}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-1 focus:ring-black focus:border-black
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
