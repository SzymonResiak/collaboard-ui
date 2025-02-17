'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backButtonHref?: string;
}

export function PageContainer({
  children,
  title,
  description,
  showBackButton,
  backButtonHref = '/boards',
}: PageContainerProps) {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className="w-[98%] mx-auto bg-white rounded-t-cb-lg shadow-2xl flex flex-col h-full relative">
        {showBackButton && (
          <Button variant="ghost" className="absolute top-4 left-4" asChild>
            <Link href={backButtonHref} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>
        )}
        <div className="w-full flex flex-col h-full">
          {(title || description) && (
            <div className="p-6 text-center">
              {title && <h1 className="text-2xl font-semibold">{title}</h1>}
              {description && (
                <p className="text-gray-600 mt-2 overflow-hidden text-ellipsis max-h-[3em]">
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
