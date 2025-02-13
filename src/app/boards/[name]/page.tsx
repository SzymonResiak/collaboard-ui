'use client';

import { Kanban } from '@/components/ui/kanban';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DropResult } from '@hello-pangea/dnd';
import { Board, Task } from '@/types/board';

const generateMockTasks = (boardName: string): Task[] => {
  return [
    // Zadania "Do zrobienia"
    {
      id: 'task-1',
      title: 'Zaimplementować logowanie',
      description: 'Dodać logowanie przez Google i GitHub',
      status: 'Do zrobienia',
      assignees: ['John Doe', 'Alice Smith'],
      dueDate: new Date('2025-02-13'),
      board: boardName,
      checklists: [
        {
          name: 'Funkcjonalności',
          items: [
            { item: 'Logowanie Google', isCompleted: false },
            { item: 'Logowanie GitHub', isCompleted: false },
          ],
        }
      ],
      attachments: [{ id: 'att1', filename: 'auth-diagram.png', path: '/attachments/auth-diagram.png' }],
    },
    {
      id: 'task-2',
      title: 'Zaprojektować stronę główną',
      description: 'Stworzyć makietę strony głównej w Figmie',
      status: 'Do zrobienia',
      assignees: ['Emma Wilson'],
      dueDate: new Date('2025-02-12'),
      board: boardName,
      checklists: [{ name: 'Design', items: [{ item: 'Mobile', isCompleted: true }] }],
    },
    {
      id: 'task-3',
      title: 'Optymalizacja wydajności',
      description: 'Zoptymalizować ładowanie obrazów i czcionek',
      status: 'Do zrobienia',
      assignees: ['Tech Team'],
      dueDate: new Date('2025-02-14'),
      board: boardName,
    },
    {
      id: 'task-4',
      title: 'Integracja z API',
      description: 'Połączyć frontend z nowym API',
      status: 'Do zrobienia',
      assignees: ['Bob Martin', 'Alice Smith'],
      dueDate: new Date('2024-04-02'),
      board: boardName,
      startedAt: new Date(),
      completedAt: new Date(),
      attachments: [{ id: 'att2', filename: 'api-docs.pdf', path: '/attachments/api-docs.pdf' }],
    },
    {
      id: 'task-5',
      title: 'Testy E2E',
      description: 'Napisać testy end-to-end dla głównych funkcjonalności',
      status: 'Do zrobienia',
      assignees: ['Test Team'],
      dueDate: new Date('2024-04-10'),
      board: boardName,
      startedAt: new Date(),
      completedAt: new Date(),
      checklists: [
        {
          name: 'Testy',
          items: [
            { item: 'Logowanie', isCompleted: false },
            { item: 'Rejestracja', isCompleted: false },
            { item: 'Dashboard', isCompleted: false },
          ],
        }
      ],
    },
    {
      id: 'task-6',
      title: 'Dokumentacja API',
      description: 'Przygotować dokumentację API w Swagger',
      status: 'Do zrobienia',
      assignees: ['Tech Writer'],
      dueDate: new Date('2024-04-15'),
      board: boardName,
      startedAt: new Date(),
      completedAt: new Date(),
    },
    {
      id: 'task-7',
      title: 'Analiza bezpieczeństwa',
      description: 'Przeprowadzić audyt bezpieczeństwa aplikacji',
      status: 'Do zrobienia',
      assignees: ['Security Team'],
      dueDate: new Date('2024-04-20'),
      board: boardName,
      startedAt: new Date(),
      completedAt: new Date(),
      checklists: [
        {
          name: 'Audyt',
          items: [
            { item: 'Analiza kodu', isCompleted: false },
            { item: 'Testy penetracyjne', isCompleted: false },
          ],
        }
      ],
    },
    {
      id: 'task-8',
      title: 'Optymalizacja SEO',
      description: 'Poprawić SEO strony głównej',
      status: 'Do zrobienia',
      assignees: ['Marketing Team'],
      dueDate: new Date('2024-04-08'),
      board: boardName,
      startedAt: new Date(),
      completedAt: new Date(),
    },
    {
      id: 'task-9',
      title: 'Responsywność',
      description: 'Sprawdzić i poprawić RWD na wszystkich podstronach',
      status: 'Do zrobienia',
      assignees: ['Frontend Team'],
      dueDate: new Date('2024-04-12'),
      board: boardName,
      startedAt: new Date(),
      completedAt: new Date(),
    },
    {
      id: 'task-10',
      title: 'Monitoring',
      description: 'Wdrożyć system monitoringu aplikacji',
      status: 'Do zrobienia',
      assignees: ['DevOps Team'],
      dueDate: new Date('2024-04-25'),
      board: boardName,
      startedAt: new Date(),
      completedAt: new Date(),
      attachments: [{ id: 'att3', filename: 'monitoring-plan.pdf', path: '/attachments/monitoring-plan.pdf' }],
    },
    // Pozostałe istniejące zadania dla innych kolumn...
    {
      id: 'task-11',
      title: 'Projekt interfejsu',
      description: 'Zaprojektować interfejs użytkownika w Figmie',
      status: 'W trakcie',
      assignees: ['Design Team'],
      dueDate: new Date('2024-03-25'),
      board: boardName,
      startedAt: new Date('2024-03-15'),
      completedAt: new Date(),
      checklists: [
        {
          name: 'Ekrany',
          items: [
            { item: 'Dashboard', isCompleted: true },
            { item: 'Profil użytkownika', isCompleted: true },
            { item: 'Ustawienia', isCompleted: false },
          ],
        },
      ],
    },
    {
      id: 'task-12',
      title: 'Testy jednostkowe',
      description: 'Napisać testy dla komponentów React',
      status: 'Zakończone',
      assignees: ['Test Team'],
      dueDate: new Date('2024-03-18'),
      board: boardName,
      startedAt: new Date('2024-03-10'),
      completedAt: new Date('2024-03-17'),
      checklists: [
        {
          name: 'Komponenty',
          items: [
            { item: 'Button', isCompleted: true },
            { item: 'Input', isCompleted: true },
            { item: 'Modal', isCompleted: true },
          ],
        },
      ],
    },
  ];
};

const createMockBoard = (name: string): Board => ({
  id: 'board-1',
  name: decodeURIComponent(name),
  description: 'descriptio',
  color: '#4A90E2',
  columns: [
    { name: 'Do zrobienia', color: '#FF5733' },
    { name: 'W trakcie', color: '#33FF57' },
    { name: 'Zakończone', color: '#3357FF' },
  ],
  admins: ['user1'],
  group: 'team-1',
  favourite: true,
  tasks: generateMockTasks(name),
});

export default function BoardPage() {
  const params = useParams();
  const boardName = params.name as string;
  const [board, setBoard] = useState<Board>(createMockBoard(boardName));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedTasks = Array.from(board.tasks);
    const taskIndex = updatedTasks.findIndex((task) => task.id === result.draggableId);

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
    <div className="flex-1 bg-background pt-4 px-4 overflow-hidden">
      <Kanban board={board} onDragEnd={handleDragEnd} />
    </div>
  );
}
