import { Task } from '@/types/task';
import React, { useCallback } from 'react';

interface BoardOrder {
  [columnId: string]: string[]; // tablica ID tasków dla każdej kolumny
}

const STORAGE_PREFIX = 'board-order-';

function getPriorityWeight(priority?: string) {
  switch (priority) {
    case 'High':
      return 3;
    case 'Mid':
      return 2;
    case 'Low':
      return 1;
    default:
      return 0;
  }
}

function sortTasks(tasks: Task[]) {
  return tasks.sort((a, b) => {
    // Najpierw sortujemy po canEdit (taski użytkownika)
    if (a.canEdit !== b.canEdit) {
      return a.canEdit ? -1 : 1;
    }

    // Następnie po priorytecie
    const aPriority = getPriorityWeight(a.priority);
    const bPriority = getPriorityWeight(b.priority);
    return bPriority - aPriority;
  });
}

function findInsertPosition(tasks: Task[], newTask: Task): number {
  for (let i = 0; i < tasks.length; i++) {
    const currentTask = tasks[i];

    // Jeśli nowy task ma wyższy priorytet, wstaw go przed obecnym
    if (
      (newTask.canEdit && !currentTask.canEdit) ||
      (newTask.canEdit === currentTask.canEdit &&
        getPriorityWeight(newTask.priority) >
          getPriorityWeight(currentTask.priority))
    ) {
      return i;
    }
  }
  return tasks.length;
}

export function useBoardOrder(boardId: string) {
  // Dodajemy stan do przechowywania aktualnej kolejności
  const [boardOrder, setBoardOrder] = React.useState<BoardOrder>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${boardId}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const getBoardOrder = useCallback(() => boardOrder, [boardOrder]);

  const saveBoardOrder = useCallback(
    (order: BoardOrder) => {
      localStorage.setItem(
        `${STORAGE_PREFIX}${boardId}`,
        JSON.stringify(order)
      );
      setBoardOrder(order);
    },
    [boardId]
  );

  const initializeBoardOrder = (columns: string[], tasks: Task[]) => {
    const currentOrder = getBoardOrder();
    const newOrder: BoardOrder = {};

    // Inicjalizujemy każdą kolumnę
    columns.forEach((columnId) => {
      const columnTasks = tasks.filter(
        (task) => task.status === columnId && task.id
      );
      const sortedTasks = sortTasks(columnTasks);

      // Zachowujemy istniejący order jeśli istnieje
      if (currentOrder[columnId]) {
        const existingIds = new Set(currentOrder[columnId]);
        const newTaskIds = sortedTasks
          .filter((task) => task.id && !existingIds.has(task.id))
          .map((task) => task.id!)
          .filter(Boolean);

        newOrder[columnId] = [...currentOrder[columnId], ...newTaskIds];
      } else {
        newOrder[columnId] = sortedTasks
          .map((task) => task.id!)
          .filter(Boolean);
      }
    });

    saveBoardOrder(newOrder);
    return newOrder;
  };

  const addNewTask = (task: Task) => {
    if (!task.id || !task.status) return;

    const order = getBoardOrder();
    if (!order[task.status]) {
      order[task.status] = [];
    }

    // Jeśli task już istnieje, nie dodawaj go ponownie
    if (order[task.status].includes(task.id)) return;

    // Znajdź odpowiednią pozycję dla nowego taska
    const columnTasks = order[task.status];
    const tasksWithDetails = columnTasks.map((id) => ({
      id,
      canEdit: false, // domyślne wartości
      priority: '',
      ...task, // nadpisz jeśli to ten sam task
    }));

    const insertPosition = findInsertPosition(tasksWithDetails as Task[], task);
    order[task.status].splice(insertPosition, 0, task.id);

    saveBoardOrder(order);
    return order;
  };

  const updateTaskOrder = (
    sourceCol: string,
    destCol: string,
    taskId: string,
    newIndex: number
  ) => {
    const order = getBoardOrder();

    // Usuń task ze źródłowej kolumny
    if (sourceCol !== destCol) {
      order[sourceCol] = (order[sourceCol] || []).filter((id) => id !== taskId);
    }

    // Dodaj task do docelowej kolumny
    const destTasks = order[destCol] || [];
    const currentIndex = destTasks.indexOf(taskId);

    if (currentIndex !== -1) {
      destTasks.splice(currentIndex, 1);
    }

    destTasks.splice(newIndex, 0, taskId);
    order[destCol] = destTasks;

    saveBoardOrder(order);
    return order;
  };

  return {
    getBoardOrder,
    initializeBoardOrder,
    updateTaskOrder,
    addNewTask,
  };
}
