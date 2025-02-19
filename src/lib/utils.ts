import { Board } from '@/types/board';
import { User } from '@/types/user';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateName(name: string, maxLength: number): string {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + '...';
}

export function isUserBoardAdmin(board: Board, user: User): boolean {
  return board.admins.some((admin) => admin === user.id);
}
