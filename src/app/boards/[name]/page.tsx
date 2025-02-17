'use client';

import { Kanban } from '@/components/ui/kanban';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Board } from '@/types/board';
import { mockBoards } from '@/mocks/groups';

export default function BoardPage() {
  const params = useParams();
  const boardId = params.name as string;
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    const foundBoard = mockBoards.find((b) => b.id === boardId);
    if (foundBoard) {
      setBoard(foundBoard);
    }
  }, [boardId]);

  if (!board) return null;

  return <Kanban board={board} onBoardChange={setBoard} />;
}
