'use client';

import { Kanban, type KanbanColumn } from '@/components/ui/kanban';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DropResult } from '@hello-pangea/dnd';

const generateCards = (prefix: string, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `Task ${i + 1}`,
    description: `This is a detailed description for task ${
      i + 1
    }. It contains more text to demonstrate scrolling and masking effects in the Kanban board.${
      i % 3 === 0
        ? ' Additional information about the task requirements and specifications.'
        : ''
    }`,
  }));
};

export default function BoardPage() {
  const params = useParams();
  const boardName = params.name as string;

  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'Do zrobienia',
      cards: generateCards('todo', 25),
    },
    {
      id: 'in-progress',
      title: 'W trakcie',
      cards: generateCards('progress', 15),
    },
    {
      id: 'done',
      title: 'Zakończone',
      cards: generateCards('done', 20),
    },
  ]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const column = columns.find((col) => col.id === source.droppableId);
      if (!column) return;

      const newCards = Array.from(column.cards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      const newColumns = columns.map((col) =>
        col.id === source.droppableId ? { ...col, cards: newCards } : col
      );

      setColumns(newColumns);
    } else {
      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find(
        (col) => col.id === destination.droppableId
      );
      if (!sourceColumn || !destColumn) return;

      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = Array.from(destColumn.cards);
      const [removed] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, removed);

      const newColumns = columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, cards: sourceCards };
        }
        if (col.id === destination.droppableId) {
          return { ...col, cards: destCards };
        }
        return col;
      });

      setColumns(newColumns);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <Kanban
        columns={columns}
        onDragEnd={handleDragEnd}
        boardName={boardName}
      />
    </div>
  );
}
