'use client';

import * as React from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
}

interface KanbanProps {
  columns: KanbanColumn[];
  onDragEnd: (result: DropResult) => void;
  boardName: string;
}

export function Kanban({ columns, onDragEnd, boardName }: KanbanProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    onDragEnd(result);
  };

  return (
    <div
      className={`w-[95%] mx-auto bg-white rounded-t-4xl h-full shadow-sm ${
        isDragging ? 'dragging-active' : ''
      }`}
    >
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold">{boardName}</h1>
      </div>
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 h-[calc(100%-5rem)] w-full overflow-x-auto p-4 select-none justify-center">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0 select-none h-full flex flex-col relative ${
                    snapshot.isDraggingOver ? 'droppable-active' : ''
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-semibold mb-4 select-none sticky top-0 bg-gray-100 z-10">
                      {column.title}
                    </h3>
                    <div className="space-y-3 overflow-y-auto flex-1 pr-2 relative pb-2">
                      <div className="flex flex-col gap-2 relative">
                        {column.cards.map((card, index) => (
                          <Draggable
                            key={card.id}
                            draggableId={card.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-3 rounded-md shadow-sm select-none task-container ${
                                  snapshot.isDragging ? 'relative z-[1000]' : ''
                                }`}
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <h4 className="font-medium select-none">
                                  {card.title}
                                </h4>
                                {card.description && (
                                  <p className="text-sm text-gray-600 mt-1 select-none">
                                    {card.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
