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
import { useState, useEffect, useRef } from 'react';
import { TaskDialog } from '../dialogs/TaskDialog';
import { Task, TaskPriority } from '@/types/task';
import { Button } from './button';
import Link from 'next/link';
import { WebSocketService } from '@/services/websocket.service';

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

/**
 * Real-time Kanban board component with WebSocket integration.
 *
 * WebSocket Events:
 * - Board Update: Receives full board state updates
 * - Task Create: Adds new task to specified column
 * - Task Update: Updates existing task (position, status, details)
 *
 * Data Flow:
 * 1. Server emits task/board update
 * 2. WebSocket receives event
 * 3. Updates local board state
 * 4. Updates orderMap in localStorage
 * 5. UI reflects changes in real-time
 *
 * Note: Column names are normalized (spaces removed, lowercase)
 * to match backend status values (e.g., "To Do" matches "TODO")
 */
export function Kanban({ board: initialBoard, onBoardChange }: KanbanProps) {
  const [board, setBoard] = useState(initialBoard);
  const [orderMap, setOrderMap] = useState<BoardOrder>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const wsService = useRef<WebSocketService | null>(null);
  const isInitialized = useRef(false);
  const initializationInProgress = useRef(false);
  const lastLocalUpdate = useRef<{ taskId: string; timestamp: number } | null>(
    null
  );

  useEffect(() => {
    if (isInitialized.current || initializationInProgress.current) return;

    async function initializeWebSocket() {
      initializationInProgress.current = true;

      try {
        if (!board?.id) return;

        if (!isInitialized.current) {
          const params = new URLSearchParams();
          params.append('ids', board.id);
          const boardResponse = await fetch(`/api/boards?${params}`);

          if (boardResponse.ok) {
            const boards = await boardResponse.json();
            const updatedBoard = boards.find((b: Board) => b.id === board.id);
            if (updatedBoard) {
              setBoard(updatedBoard);
              onBoardChange?.(updatedBoard);

              const savedOrder = localStorage.getItem(
                `board-order-${board.id}`
              );
              const currentOrder: BoardOrder = savedOrder
                ? JSON.parse(savedOrder)
                : {};

              const newOrderMap = { ...currentOrder };
              updatedBoard.columns.forEach((column) => {
                const columnTasks = updatedBoard.tasks.filter(
                  (task) => task.status === column.name
                );

                const newTasks = columnTasks
                  .filter(
                    (task) => !currentOrder[column.name]?.includes(task.id)
                  )
                  .map((task) => task.id);

                newOrderMap[column.name] = [
                  ...newTasks,
                  ...(currentOrder[column.name] || []).filter((taskId) =>
                    columnTasks.some((task) => task.id === taskId)
                  ),
                ];
              });

              localStorage.setItem(
                `board-order-${board.id}`,
                JSON.stringify(newOrderMap)
              );
              setOrderMap(newOrderMap);
            }
          }
        }

        const response = await fetch('/api/auth/token');
        const data = await response.json();

        if (!response.ok || !data.token) {
          return;
        }

        if (!isInitialized.current) {
          wsService.current = await WebSocketService.initialize();
          wsService.current.joinBoard(board.id);
          isInitialized.current = true;

          wsService.current.onBoardUpdate((updatedBoard) => {
            setBoard(updatedBoard);
            onBoardChange?.(updatedBoard);
          });

          wsService.current.onTaskUpdate((taskData) => {
            if (taskData.type === 'CREATE') {
              const taskStatus = taskData.task.status
                .toLowerCase()
                .replace(/\s+/g, '');
              const columnName = board.columns.find(
                (col) =>
                  col.name.toLowerCase().replace(/\s+/g, '') === taskStatus
              )?.name;

              setBoard((prev) => ({
                ...prev,
                tasks: [taskData.task, ...prev.tasks],
              }));

              setOrderMap((prevOrder) => {
                const updatedOrder = {
                  ...prevOrder,
                  [columnName]: [
                    taskData.task.id,
                    ...(prevOrder[columnName] || []),
                  ],
                };
                localStorage.setItem(
                  `board-order-${board.id}`,
                  JSON.stringify(updatedOrder)
                );
                return updatedOrder;
              });
            } else if (taskData.type === 'UPDATE') {
              const isRecentLocalUpdate =
                lastLocalUpdate.current?.taskId === taskData.task.id &&
                Date.now() - (lastLocalUpdate.current?.timestamp || 0) < 5000;

              setBoard((prev) => ({
                ...prev,
                tasks: prev.tasks.map((task) =>
                  task.id === taskData.task.id ? taskData.task : task
                ),
              }));

              if (!isRecentLocalUpdate) {
                const newStatus = taskData.task.status
                  .toLowerCase()
                  .replace(/\s+/g, '');
                const newColumnName = board.columns.find(
                  (col) =>
                    col.name.toLowerCase().replace(/\s+/g, '') === newStatus
                )?.name;

                setOrderMap((prevOrder) => {
                  const updatedOrder = { ...prevOrder };

                  Object.keys(updatedOrder).forEach((columnName) => {
                    updatedOrder[columnName] = updatedOrder[columnName].filter(
                      (id) => id !== taskData.task.id
                    );
                  });

                  updatedOrder[newColumnName] = [
                    taskData.task.id,
                    ...(updatedOrder[newColumnName] || []),
                  ];

                  localStorage.setItem(
                    `board-order-${board.id}`,
                    JSON.stringify(updatedOrder)
                  );
                  return updatedOrder;
                });
              }
            }
          });
        }
      } catch (error) {
        console.error('❌ Failed to initialize board connection');
      } finally {
        initializationInProgress.current = false;
      }
    }

    initializeWebSocket();

    return () => {
      if (wsService.current && board?.id) {
        wsService.current.leaveBoard(board.id);
        wsService.current.cleanup();
        isInitialized.current = false;
        initializationInProgress.current = false;
      }
    };
  }, [board?.id]);

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

  /**
   * Handles drag and drop operations in the Kanban board.
   * For same column moves:
   * - Updates only the order in localStorage without API calls
   * For cross-column moves:
   * - Updates task status via API
   * - Updates local state and order
   * - Handles rollback if API call fails
   * - Manages WebSocket update synchronization using lastLocalUpdate
   */
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const newOrderMap = { ...orderMap };
      const column = newOrderMap[source.droppableId];

      column.splice(source.index, 1);
      column.splice(destination.index, 0, draggableId);
      newOrderMap[source.droppableId] = column;

      localStorage.setItem(
        `board-order-${board.id}`,
        JSON.stringify(newOrderMap)
      );
      setOrderMap(newOrderMap);
      return;
    }

    const rollbackState = {
      orderMap: JSON.parse(JSON.stringify(orderMap)),
      board: JSON.parse(JSON.stringify(board)),
      localStorage: localStorage.getItem(`board-order-${board.id}`),
    };

    const performRollback = () => {
      setOrderMap(rollbackState.orderMap);
      setBoard(rollbackState.board);
      if (rollbackState.localStorage) {
        localStorage.setItem(
          `board-order-${board.id}`,
          rollbackState.localStorage
        );
      }
      console.error('❌ Failed to update task. Changes have been reverted.');
    };

    try {
      lastLocalUpdate.current = {
        taskId: draggableId,
        timestamp: Date.now(),
      };

      const newOrderMap = { ...orderMap };
      newOrderMap[source.droppableId] = newOrderMap[source.droppableId].filter(
        (id) => id !== draggableId
      );

      const destTasks = newOrderMap[destination.droppableId] || [];
      destTasks.splice(destination.index, 0, draggableId);
      newOrderMap[destination.droppableId] = destTasks;

      const updatedTasks = board.tasks.map((task) => {
        if (task.id === draggableId) {
          return {
            ...task,
            status: destination.droppableId,
          };
        }
        return task;
      });

      localStorage.setItem(
        `board-order-${board.id}`,
        JSON.stringify(newOrderMap)
      );
      setOrderMap(newOrderMap);

      const updatedBoard = {
        ...board,
        tasks: updatedTasks,
      };
      setBoard(updatedBoard);

      const response = await fetch(`/api/tasks/${draggableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: destination.droppableId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      onBoardChange?.(updatedBoard);
    } catch (error) {
      performRollback();
    }
  };

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
        tasks: Array(column.tasks.length).fill(null),
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
