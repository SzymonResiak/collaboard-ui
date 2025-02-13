'use client';

import { Kanban } from '@/components/ui/kanban';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DropResult } from '@hello-pangea/dnd';
import { Board } from '@/types/board';
import { getMockBoard } from '@/mocks/boards';

export default function BoardPage() {
  const params = useParams();
  const boardName = params.name as string;
  const [board, setBoard] = useState<Board>(getMockBoard(boardName));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedTasks = Array.from(board.tasks);
    const taskIndex = updatedTasks.findIndex(
      (task) => task.id === result.draggableId
    );

    if (taskIndex === -1) return;

    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      status: destination.droppableId,
    };

    setBoard({
      ...board,
      tasks: updatedTasks,
    });
  };

  return (
    <div className="flex-1 bg-background pt-2 sm:pt-4 px-2 sm:px-4 overflow-hidden">
      <Kanban board={board} onDragEnd={handleDragEnd} />
    </div>
  );
}
