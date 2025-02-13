'use client';

import * as React from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd'; 
import { Board, Task } from '../../types/board';
import { Avatar } from './avatar';
import { CheckSquare, Paperclip, Calendar } from 'lucide-react';

export interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

interface KanbanProps {
  board: Board;
  onDragEnd: (result: DropResult) => void;
}

// Dodaj te style do globals.css lub jako styled-components
const scrollbarStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #CBD5E1 transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #CBD5E1;
    border-radius: 3px;
  }
`;

function getDaysUntil(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  return `${diffDays} days`;
}

function getDateStatusClasses(dueDate: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dueDate);
  taskDate.setHours(0, 0, 0, 0);
  
  if (taskDate.getTime() < today.getTime()) {
    return 'bg-red-100 text-red-700';
  } else {
    return 'bg-gray-50 text-gray-600';
  }
}

export function Kanban({ board, onDragEnd }: KanbanProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    onDragEnd(result);
  };

  // Przygotuj kolumny z zadaniami
  const columns: KanbanColumn[] = board.columns.map(column => ({
    id: column.name,
    name: column.name,
    color: column.color,
    tasks: board.tasks.filter(task => task.status === column.name)
  }));

  return (
    <div
      className={`w-[95%] mx-auto bg-white rounded-t-cb-lg shadow-lg flex flex-col h-full ${
        isDragging ? 'dragging-active' : ''
      }`}
    >
      <div className="p-6 text-center flex-shrink-0">
        <h1 className="text-2xl font-semibold">{board.name}</h1>
        {board.description && (
          <p className="text-gray-600 mt-2">{board.description}</p>
        )}
      </div>
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div 
          className="flex gap-6 flex-1 w-full p-4 select-none overflow-x-auto custom-scrollbar justify-center"
        >
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ 
                    backgroundColor: column.color + '20',
                    ...(snapshot.isDraggingOver ? {
                      outline: `2px dashed ${column.color}`,
                      outlineOffset: '2px'
                    } : {})
                  }}
                  className={`
                    rounded-cb p-4 select-none h-full flex flex-col relative 
                    min-w-[280px] flex-shrink-0
                    w-[calc(95vw-2rem)]
                    cbTablet:w-[380px]
                    cbDesktop:w-[320px]
                    cbDesktopM:w-[360px]
                    cbDesktopL:w-[380px]
                  `}
                >
                  <div className="flex flex-col h-full">
                    <h3 
                      className="font-semibold mb-4 select-none sticky top-0 z-10 p-2 rounded-cb-base text-center"
                      style={{ backgroundColor: column.color + '40' }}
                    >
                      {column.name}
                    </h3>
                    <div className="space-y-3 overflow-y-auto flex-1 pr-2 relative pb-2 custom-scrollbar">
                      <div className="flex flex-col gap-2 relative z-[1]">
                        {column.tasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  bg-white p-3 rounded-cb-base shadow-sm select-none task-container relative 
                                  ${snapshot.isDragging ? 'relative z-[1000]' : 'z-[2]'}
                                  hover:shadow-md transition-shadow
                                `}
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium select-none">{task.title}</h4>
                                  <div className="flex -space-x-2">
                                    {task.assignees.map((assignee, index) => (
                                      <Avatar 
                                        key={index} 
                                        name={assignee} 
                                        size="sm"
                                        columnColor={column.color}
                                      />
                                    ))}
                                  </div>
                                </div>
                                
                                {task.description && (
                                  <p className="text-sm text-gray-600 mt-1 select-none">
                                    {task.description}
                                  </p>
                                )}
                                
                                <div className="mt-3 flex items-center justify-between">
                                  <div className="flex gap-2">
                                    {task.checklists && task.checklists.length > 0 && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <CheckSquare className="w-4 h-4" />
                                        <span>
                                          {task.checklists.reduce((acc, list) => 
                                            acc + list.items.filter(item => item.isCompleted).length, 0
                                          )}/
                                          {task.checklists.reduce((acc, list) => 
                                            acc + list.items.length, 0
                                          )}
                                        </span>
                                      </div>
                                    )}
                                    {task.attachments && task.attachments.length > 0 && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Paperclip className="w-4 h-4" />
                                        <span>{task.attachments.length}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {task.dueDate && (
                                    <div className="flex items-center gap-1 text-xs">
                                      <Calendar className="w-4 h-4 text-gray-500" />
                                      <span className={`
                                        px-2 py-0.5 rounded-cb-sm
                                        ${getDateStatusClasses(task.dueDate)}
                                      `}>
                                        {getDaysUntil(task.dueDate)}
                                      </span>
                                    </div>
                                  )}
                                </div>
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
