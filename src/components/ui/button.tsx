import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-lg font-medium font-nunito transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow hover:from-gray-800 hover:to-gray-700 active:from-gray-950 active:to-gray-900',
        destructive:
          'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-sm hover:from-red-700 hover:to-red-600',
        outline:
          'border-2 border-gray-200 bg-white text-gray-900 shadow-sm hover:border-gray-300 hover:bg-gray-50',
        secondary:
          'bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-sm hover:from-gray-700 hover:to-gray-600',
        ghost: 'text-gray-900 hover:bg-[#ECE6F0]',
        link: 'text-gray-900 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-full px-4 text-xs',
        lg: 'h-12 rounded-full px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
