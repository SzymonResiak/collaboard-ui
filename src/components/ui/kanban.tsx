'use client';

import * as React from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { Board, Task, TaskPriority } from '../../types/board';
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

function getPriorityColor(priority?: TaskPriority): string {
  switch (priority) {
    case TaskPriority.High:
      return 'bg-red-100 text-red-700';
    case TaskPriority.Medium:
      return 'bg-yellow-100 text-yellow-700';
    case TaskPriority.Low:
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

const COLUMN_WIDTHS = [
  'w-[30%]', // 1 column
  'w-[30%]', // 2 columns
  'w-[22.5%]', // 3 columns
  'w-[20%]', // 4 columns
  'w-[16%]', // 5 columns
] as const;

export function Kanban({ board, onDragEnd }: KanbanProps) {
  const handleDragStart = () => {};

  const handleDragEnd = (result: DropResult) => {
    onDragEnd(result);
  };

  const columns: KanbanColumn[] = board.columns.map((column) => ({
    id: column.name,
    name: column.name,
    color: column.color,
    tasks: board.tasks.filter((task) => task.status === column.name),
  }));

  const columnWidth = COLUMN_WIDTHS[Math.min(board.columns.length - 1, 4)];

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className="w-[98%] mx-auto bg-white rounded-t-cb-lg shadow-lg flex flex-col h-full">
        <div className="w-full flex flex-col h-full">
          <div className="p-6 text-center">
            <h1 className="text-2xl font-semibold">{board.name}</h1>
            {board.description && (
              <p className="text-gray-600 mt-2 overflow-hidden text-ellipsis max-h-[3em]">
                {board.description}
              </p>
            )}
          </div>
          <DragDropContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 w-full px-4 pb-6 select-none overflow-x-hidden justify-center h-full">
              {columns.map((column) => (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        backgroundColor: column.color + '20',
                        ...(snapshot.isDraggingOver
                          ? {
                              outline: `2px dashed ${column.color}`,
                              outlineOffset: '-2px',
                            }
                          : {}),
                      }}
                      className={`
                        rounded-cb p-3 select-none flex flex-col relative 
                        min-w-[15%] flex-shrink-0 h-full
                        ${columnWidth}
                      `}
                    >
                      <div className="flex flex-col h-full">
                        <h3
                          className="font-semibold mb-4 select-none sticky top-0 z-10 p-2 rounded-cb-base text-center text-2xl"
                          style={{ backgroundColor: column.color + '40' }}
                        >
                          {column.name}
                        </h3>
                        <div className="space-y-3 overflow-y-auto pl-2 pr-2 scrollbar-gutter relative pb-4">
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
                                      ${
                                        snapshot.isDragging
                                          ? 'relative z-[1000]'
                                          : 'z-[2]'
                                      }
                                      hover:shadow-md transition-shadow
                                      min-h-[140px] flex flex-col
                                    `}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold select-none max-w-[75%] text-base truncate">
                                        {task.title}
                                      </h4>
                                      {task.priority && (
                                        <span
                                          className={`
                                            px-2 py-1 rounded-cb-sm text-xs font-medium shrink-0
                                            ${getPriorityColor(task.priority)}
                                          `}
                                        >
                                          {task.priority}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex justify-between mb-2">
                                      {task.description && (
                                        <p className="text-sm text-gray-600 mt-1 select-none max-w-[80%] overflow-hidden text-ellipsis max-h-[3em]">
                                          {task.description}
                                        </p>
                                      )}
                                      <div className="flex flex-row-reverse ml-2 flex-shrink-0 self-start">
                                        {task.assignees.map(
                                          (assignee, index, arr) => {
                                            if (index === 0) {
                                              return (
                                                <div
                                                  key={index}
                                                  className="relative"
                                                  style={{
                                                    zIndex: arr.length - index,
                                                  }}
                                                >
                                                  <Avatar
                                                    name={assignee}
                                                    size="sm"
                                                    columnColor={column.color}
                                                  />
                                                  {arr.length > 1 && (
                                                    <div className="absolute -right-2 -bottom-2 bg-white text-gray-900 text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 shadow-sm border border-gray-200">
                                                      {arr.length > 99
                                                        ? '>99'
                                                        : `+${arr.length - 1}`}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            }
                                            return null;
                                          }
                                        )}
                                      </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                      <div className="flex gap-2">
                                        {task.checklists &&
                                          task.checklists.length > 0 && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                              <CheckSquare className="w-4 h-4" />
                                              <span>
                                                {task.checklists.length}
                                              </span>
                                            </div>
                                          )}
                                        {task.attachments &&
                                          task.attachments.length > 0 && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                              <Paperclip className="w-4 h-4" />
                                              <span>
                                                {task.attachments.length}
                                              </span>
                                            </div>
                                          )}
                                      </div>

                                      {task.dueDate && (
                                        <div className="flex items-center gap-1 text-xs">
                                          <Calendar className="w-4 h-4 text-gray-500" />
                                          <span
                                            className={`
                                            px-2 py-0.5 rounded-cb-sm
                                            ${getDateStatusClasses(
                                              task.dueDate
                                            )}
                                          `}
                                          >
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
      </div>
    </div>
  );
}
