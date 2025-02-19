'use client';

import { Kanban } from '@/components/ui/kanban';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Board } from '@/types/board';

export default function BoardPage() {
  const router = useRouter();
  const params = useParams();
  const boardName = params.name as string;
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const encodedName = encodeURIComponent(boardName);
        const response = await fetch(`/api/boards/name/${encodedName}`);
        const data = await response.json();

        if (data.error) {
          console.error('Error fetching board:', data.error);
          return;
        }

        setBoard(data);
      } catch (error) {
        console.error('Error fetching board:', error);
        router.push('/boards');
      }
    };

    fetchBoard();
  }, [boardName, router]);

  if (!board) return null;

  return <Kanban board={board} onBoardChange={setBoard} />;
}
