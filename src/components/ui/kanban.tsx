'use client';

import * as React from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  DroppableProvided,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd';
import { Board } from '@/types/board';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useMemo, useReducer, useEffect } from 'react';
import { Task } from '@/types/task';
import { Button } from './button';
import Link from 'next/link';
import { TaskCard } from '@/components/cards/task-card';
import { WebSocketService } from '@/services/websocket.service';
import { useBoardOrder } from '@/hooks/useBoardOrder';

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

interface KanbanState {
  board: Board;
}

type KanbanAction =
  | { type: 'UPDATE_BOARD'; payload: Board }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task };

function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  switch (action.type) {
    case 'UPDATE_BOARD':
      return { board: action.payload };
    case 'ADD_TASK':
      return {
        board: {
          ...state.board,
          tasks: [...state.board.tasks, action.payload],
        },
      };
    case 'UPDATE_TASK':
      return {
        board: {
          ...state.board,
          tasks: state.board.tasks.map((t) =>
            t.id === action.payload.id ? action.payload : t
          ),
        },
      };
    default:
      return state;
  }
}

export function Kanban({ board: initialBoard }: KanbanProps) {
  const [state, dispatch] = useReducer(kanbanReducer, {
    board: initialBoard,
  });
  // Dodajemy stan do śledzenia zmian w kolejności
  const [boardOrderVersion, setBoardOrderVersion] = React.useState(0);

  const wsRef = React.useRef<WebSocketService | null>(null);
  const localUpdatesRef = React.useRef<Set<string>>(new Set());

  const { getBoardOrder, initializeBoardOrder, updateTaskOrder, addNewTask } =
    useBoardOrder(state.board.id);

  // Inicjalizacja board order przy pierwszym renderze
  useEffect(() => {
    const columnIds = state.board.columns.map((col) => col.name);
    initializeBoardOrder(columnIds, state.board.tasks);
  }, [state.board.id]);

  // Modyfikujemy onDragEnd aby wymuszał przerenderowanie po aktualizacji kolejności
  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;

      // Jeśli przeciągamy w tej samej kolumnie
      if (destination.droppableId === source.droppableId) {
        // Aktualizujemy tylko kolejność w tej samej kolumnie
        updateTaskOrder(
          source.droppableId,
          destination.droppableId,
          draggableId,
          destination.index
        );
        // Wymuszamy przerenderowanie
        setBoardOrderVersion((v) => v + 1);
        return;
      }

      // Dla przenoszenia między kolumnami
      const task = state.board.tasks.find((t) => t.id === draggableId);
      if (!task) return;

      const destColumn = state.board.columns.find(
        (col) => col.name === destination.droppableId
      );
      if (!destColumn) return;

      // Dodajemy ID taska do lokalnych zmian
      localUpdatesRef.current.add(draggableId);

      // Natychmiast aktualizujemy lokalny stan
      const updatedTask = { ...task, status: destination.droppableId };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });

      // Aktualizujemy kolejność dla przeniesienia między kolumnami
      updateTaskOrder(
        source.droppableId,
        destination.droppableId,
        draggableId,
        destination.index
      );
      // Wymuszamy przerenderowanie
      setBoardOrderVersion((v) => v + 1);

      try {
        const response = await fetch(`/api/tasks/${draggableId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: destination.droppableId }),
        });

        if (!response.ok) {
          // W przypadku błędu, przywracamy poprzedni stan
          localUpdatesRef.current.delete(draggableId);
          const revertedTask = { ...task, status: source.droppableId };
          dispatch({ type: 'UPDATE_TASK', payload: revertedTask });
          throw new Error('Failed to update task status');
        }
      } catch (error) {
        console.error('[Kanban] Failed to update task:', error);
      }
    },
    [state.board, updateTaskOrder]
  );

  useEffect(() => {
    let isSubscribed = true;

    const initializeWebSocket = async () => {
      try {
        if (!wsRef.current) {
          wsRef.current = await WebSocketService.initialize();
        }

        if (!wsRef.current) {
          throw new Error('Failed to initialize WebSocket');
        }

        await wsRef.current.joinBoard(state.board.id);

        if (!isSubscribed) return;

        const unsubscribeCreate = wsRef.current.onTaskCreated((newTask) => {
          if (isSubscribed) {
            dispatch({ type: 'ADD_TASK', payload: newTask });
            addNewTask(newTask); // Dodaj nowy task do board order
          }
        });

        const unsubscribeUpdate = wsRef.current.onTaskUpdated(({ task }) => {
          if (!task.id) return;

          if (localUpdatesRef.current.has(task.id)) {
            localUpdatesRef.current.delete(task.id);
            return;
          }

          if (isSubscribed) {
            dispatch({ type: 'UPDATE_TASK', payload: task });
            addNewTask(task);
          }
        });

        return () => {
          unsubscribeCreate();
          unsubscribeUpdate();
        };
      } catch (error) {
        console.error('[Kanban] WebSocket initialization error:', error);
      }
    };

    initializeWebSocket();

    return () => {
      isSubscribed = false;
      if (wsRef.current) {
        wsRef.current.leaveBoard(state.board.id);
        wsRef.current = null;
      }
    };
  }, [state.board.id, addNewTask]);

  // Dodajemy boardOrderVersion do zależności useMemo
  const columns = useMemo(() => {
    const boardOrder = getBoardOrder();

    return state.board.columns.map((column) => {
      const columnTasks =
        state.board.tasks?.filter((task) => task.status === column.name) || [];

      // Sortujemy taski według zapisanego orderu w boardOrder
      const orderedTasks = boardOrder[column.name]
        ? [...columnTasks].sort((a, b) => {
            if (!a.id || !b.id) return 0;
            const aIndex = boardOrder[column.name].indexOf(a.id);
            const bIndex = boardOrder[column.name].indexOf(b.id);
            // Jeśli task nie jest w boardOrder, umieść go na końcu
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            // Sortuj według kolejności w boardOrder
            return aIndex - bIndex;
          })
        : columnTasks;

      return {
        id: column.name,
        name: column.name,
        color: column.color || '#E5E7EB',
        tasks: orderedTasks,
      };
    });
  }, [
    state.board.columns,
    state.board.tasks,
    getBoardOrder,
    boardOrderVersion,
  ]);

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
            <h1 className="text-2xl font-semibold">{state.board.name}</h1>
            {state.board.description && (
              <p className="text-gray-600 mt-2">{state.board.description}</p>
            )}
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-10 w-full px-4 pb-6 select-none overflow-x-hidden justify-center h-full">
              {columns.map((column) => (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided, snapshot) => (
                    <KanbanColumn
                      column={column}
                      provided={provided}
                      snapshot={snapshot}
                      board={state.board}
                    />
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

interface KanbanColumnProps {
  column: KanbanColumn;
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  board: Board;
}

const KanbanColumn = React.memo<KanbanColumnProps>(
  ({ column, provided, snapshot, board }) => (
    <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="rounded-cb p-3 select-none flex flex-col relative min-w-[15%] flex-shrink-0 h-full"
      style={{
        backgroundColor: column.color + '20',
        ...(snapshot.isDraggingOver
          ? { outline: `2px dashed ${column.color}`, outlineOffset: '-2px' }
          : {}),
      }}
    >
      <div className="flex flex-col h-full">
        <h3
          className="font-semibold mb-4 select-none sticky top-0 z-10 p-2 rounded-cb text-center text-2xl"
          style={{ backgroundColor: column.color + '40' }}
        >
          {column.name}
        </h3>
        <div className="space-y-3 overflow-y-auto pl-2 pr-2 scrollbar-gutter relative pb-4">
          <div className="flex flex-col gap-2">
            {column.tasks
              ?.filter((task) => task.id != null)
              .map((task, index) => (
                <Draggable key={task.id} draggableId={task.id!} index={index}>
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                    >
                      <TaskCard task={task} board={board} />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        </div>
      </div>
    </div>
  )
);

KanbanColumn.displayName = 'KanbanColumn';
