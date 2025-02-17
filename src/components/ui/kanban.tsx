'use client';

import * as React from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { Board, BoardOrder } from '../../types/board';
import { Avatar } from './avatar';
import { CheckSquare, Paperclip, Calendar, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TaskDialog } from '../dialogs/TaskDialog';
import { Task, TaskPriority } from '@/types/task';
import { Button } from './button';
import Link from 'next/link';

/* TODO: after api implemented at frontend.
  - przy dodaniu nowego taska trzeba go dodać jako pierwszy w danej kolumnie.
  - dodać możliwość sortowania tasków w kolumnie: !priority, co przywróci sortowanie domyślne: canEdit -> priority. Takie sortowanie zostanie dodane na backendzie przy zwrotce board.tasks.
  - dodać websocket do aktualizacji board po zmianie kolejności tasków w kolumnie: sortowanie: canEdit -> priority.
*/

export interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

interface KanbanProps {
  board: Board;
  onBoardChange?: (board: Board) => void;
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
];

function KanbanTaskSkeleton() {
  return (
    <div className="bg-white p-3 rounded-cb-base shadow-sm min-h-[140px] flex flex-col animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>

      <div className="flex justify-between mb-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 mt-1"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-4 w-8 bg-gray-200 rounded"></div>
          <div className="h-4 w-8 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  const handleUpdateTask = async (updatedTask: Partial<Task>) => {
    try {
      console.log('Updating task:', { ...task, ...updatedTask });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const MAX_VISIBLE_ASSIGNEES = 5;
  const visibleAssignees =
    task.assignees?.slice(0, MAX_VISIBLE_ASSIGNEES) || [];
  const remainingCount = Math.max(
    0,
    (task.assignees?.length || 0) - MAX_VISIBLE_ASSIGNEES
  );

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white p-3 rounded-cb-base shadow-sm select-none relative hover:shadow-md transition-shadow min-h-[140px] flex flex-col cursor-pointer"
      >
        <div className="flex justify-between items-center mb-2">
          {task.priority && (
            <span
              className={`px-2 py-1 rounded-cb-sm text-xs font-medium ${getPriorityColor(
                task.priority as TaskPriority
              )}`}
            >
              {task.priority}
            </span>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span
                className={`px-2 py-0.5 rounded-cb-sm ${getDateStatusClasses(
                  task.dueDate
                )}`}
              >
                {getDaysUntil(task.dueDate)}
              </span>
            </div>
          )}
        </div>

        <h4 className="font-semibold text-base truncate mb-4">{task.title}</h4>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-2">
            {task.checklists && task.checklists.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <CheckSquare className="w-4 h-4" />
                <span>{task.checklists.length}</span>
              </div>
            )}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Paperclip className="w-4 h-4" />
                <span>{task.attachments.length}</span>
              </div>
            )}
          </div>

          <div className="flex flex-row-reverse -space-x-1 space-x-reverse items-center">
            {remainingCount > 0 && (
              <div className="relative z-0 ml-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 border border-white">
                  {remainingCount > 99 ? '>99' : `+${remainingCount}`}
                </div>
              </div>
            )}
            {visibleAssignees.map((assignee, index) => (
              <div
                key={assignee.id}
                className="relative hover:z-10"
                style={{ zIndex: visibleAssignees.length - index }}
              >
                <Avatar
                  name={assignee.name}
                  image={assignee.avatar}
                  size="sm"
                  columnColor={task.status === 'TODO' ? '#4A90E2' : '#6B7280'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <TaskDialog
        mode="view"
        task={task}
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleUpdateTask}
      />
    </>
  );
}

export function Kanban({ board: initialBoard, onBoardChange }: KanbanProps) {
  const [board, setBoard] = useState(initialBoard);
  const [orderMap, setOrderMap] = useState<BoardOrder>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Inicjalizacja po hydratacji
  useEffect(() => {
    const savedOrder = localStorage.getItem(`board-order-${board.id}`);
    if (savedOrder) {
      setOrderMap(JSON.parse(savedOrder));
    } else {
      const defaultOrder: BoardOrder = {};
      board.columns.forEach((column) => {
        defaultOrder[column.name] = board.tasks
          .filter((task) => task.status === column.name)
          .map((task) => task.id);
      });
      setOrderMap(defaultOrder);
    }
    setIsHydrated(true);
  }, [board.id]);

  const columns: KanbanColumn[] = board.columns.map((column) => ({
    id: column.name,
    name: column.name,
    color: column.color || '#E5E7EB',
    tasks: board.tasks.filter((task) => task.status === column.name),
  }));

  const columnWidth = COLUMN_WIDTHS[Math.min(board.columns.length - 1, 4)];

  const onDragEnd = (result: DropResult) => {
    const { destination } = result;
    if (!destination) return;

    // Aktualizuj kolejność
    const newOrderMap = { ...orderMap };

    // Usuń task ze źródłowej kolumny
    newOrderMap[result.source.droppableId] = newOrderMap[
      result.source.droppableId
    ].filter((id) => id !== result.draggableId);

    // Dodaj task do docelowej kolumny we właściwej pozycji
    const destTasks = newOrderMap[destination.droppableId] || [];
    destTasks.splice(destination.index, 0, result.draggableId);
    newOrderMap[destination.droppableId] = destTasks;

    // Znajdź i zaktualizuj status taska
    const updatedTasks = board.tasks.map((task) => {
      if (task.id === result.draggableId) {
        return {
          ...task,
          status: destination.droppableId,
        };
      }
      return task;
    });

    // Zaktualizuj localStorage i stan
    localStorage.setItem(
      `board-order-${board.id}`,
      JSON.stringify(newOrderMap)
    );
    setOrderMap(newOrderMap);

    // Zaktualizuj lokalny stan i wywołaj callback
    const updatedBoard = {
      ...board,
      tasks: updatedTasks,
    };
    setBoard(updatedBoard);
    onBoardChange?.(updatedBoard);
  };

  // Sortuj taski według zapisanej kolejności tylko po hydratacji
  const sortedColumns = isHydrated
    ? columns.map((column) => ({
        ...column,
        tasks: orderMap[column.name]
          ? orderMap[column.name]
              .map((taskId) => column.tasks.find((t) => t.id === taskId))
              .filter(Boolean)
          : column.tasks,
      }))
    : columns.map((column) => ({
        ...column,
        tasks: Array(column.tasks.length).fill(null), // Placeholder dla skeletonów
      }));

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className="w-[98%] mx-auto bg-white rounded-t-cb-lg shadow-2xl flex flex-col h-full relative">
        <Button variant="ghost" className="absolute top-4 left-4" asChild>
          <Link href="/boards" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
        </Button>
        <div className="w-full flex flex-col h-full">
          <div className="p-6 text-center">
            <h1 className="text-2xl font-semibold">{board.name}</h1>
            {board.description && (
              <p className="text-gray-600 mt-2 overflow-hidden text-ellipsis max-h-[3em]">
                {board.description}
              </p>
            )}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-10 w-full px-4 pb-6 select-none overflow-x-hidden justify-center h-full">
              {sortedColumns.map((column) => (
                <Droppable key={column.name} droppableId={column.name}>
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
                          className="font-semibold mb-4 select-none sticky top-0 z-10 p-2 rounded-cb text-center text-2xl"
                          style={{ backgroundColor: column.color + '40' }}
                        >
                          {column.name}
                        </h3>
                        <div className="space-y-3 overflow-y-auto pl-2 pr-2 scrollbar-gutter relative pb-4">
                          <div className="flex flex-col gap-2 relative z-[1]">
                            {column.tasks.map((task, index) =>
                              isHydrated ? (
                                <Draggable
                                  key={task?.id}
                                  draggableId={task?.id || ''}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="relative"
                                    >
                                      <TaskCard task={task} />
                                    </div>
                                  )}
                                </Draggable>
                              ) : (
                                <KanbanTaskSkeleton key={index} />
                              )
                            )}
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
