import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/NavbarWrapper';
import { cn } from '@/lib/utils';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  preload: true,
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Collaboard',
  description: 'Collaboard is a collaborative kanban board app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          nunito.variable,
          'h-screen flex flex-col overflow-hidden'
        )}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
