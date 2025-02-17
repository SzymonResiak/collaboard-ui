import { Group } from '@/types/group';
import { Board } from '@/types/board';
import { TaskPriority } from '@/types/task';
import { mockUsers } from './boards';

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Engineering Team Engineering TeamEngineering TeamEngineering TeamEngineering Team',
    description: 'Main engineering team workspace',
    favourite: true,
    members: ['user-1', 'user-2', 'user-3'],
    admins: ['user-1'],
  },
  {
    id: 'group-2',
    name: 'Marketing',
    description: 'Marketing team projects and campaigns',
    favourite: false,
    members: ['user-4', 'user-5'],
    admins: ['user-4'],
  },
  {
    id: 'group-3',
    name: 'Product Design',
    description: 'UI/UX and product design team',
    favourite: true,
    members: ['user-6', 'user-7', 'user-8'],
    admins: ['user-6'],
  },
];

export const mockBoards: Board[] = [
  {
    id: 'board-111',
    name: 'Sprint Board',
    description: 'Current sprint tasks and progress',
    color: '#4A90E2',
    columns: [
      { name: 'Backlog', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-1'],
    group: 'group-1',
    favourite: true,
    tasks: [],
  },
  {
    id: 'board-2',
    name: 'Marketing Campaign',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-3',
    name: 'Design System',
    description: 'Company design system components',
    color: '#8B5CF6',
    columns: [
      { name: 'Backlog', color: '#6B7280' },
      { name: 'In Design', color: '#8B5CF6' },
      { name: 'In Development', color: '#F59E0B' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-6'],
    group: 'group-3',
    favourite: true,
    tasks: [],
  },
  {
    id: 'board-4',
    name: 'Marketing Campaign 2',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-5',
    name: 'Marketing Campaign 3',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-6',
    name: 'Marketing Campaign 5',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-7',
    name: 'Marketing Campaign 6',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-9',
    name: 'Marketing Campaign 7',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-10',
    name: 'Marketing Campaign 7',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-11',
    name: 'Marketing Campaign 7',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-12',
    name: 'Marketing Campaign 7',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-13',
    name: 'Marketing Campaign 7',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-14',
    name: 'Marketing Campaign 7',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-15',
    name: 'Marketing Campaign 7',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-16',
    name: 'Marketing Campaign 7',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-17',
    name: 'Marketing Campaign 7',
    description: 'Q2 Marketing initiatives',
    color: '#F59E0B',
    columns: [
      { name: 'To Do', color: '#6B7280' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Review', color: '#8B5CF6' },
      { name: 'Done', color: '#10B981' },
    ],
    admins: ['user-4'],
    group: 'group-2',
    favourite: false,
    tasks: [],
  },
  {
    id: 'board-1',
    name: 'Project Tasks',
    description: 'Tablica projektowa dla zespołu deweloperskiego',
    color: '#4A90E2',
    columns: [
      { name: 'Backlog', color: '#6B7280' }, // szary
      { name: 'Do zrobienia', color: '#FF5733' }, // czerwony
      { name: 'W trakcie', color: '#33FF57' }, // zielony
      { name: 'Do testów', color: '#FFB733' }, // pomarańczowy
      { name: 'Zakończone', color: '#3357FF' }, // niebieski
    ],
    admins: ['user1', 'user2'],
    group: 'team-1',
    favourite: true,
    tasks: [
      {
        id: 'task-1',
        title: 'Zaimplementować logowanie',
        description: 'Dodać implementację logowania przez Google i GitHub',
        priority: TaskPriority.Medium,
        canEdit: true,
        status: 'Do zrobienia',
        assignees: [
          mockUsers[0], // John Doe z avatarem
          mockUsers[1], // Jane Smith bez avatara
          mockUsers[2], // Mike Johnson z avatarem
          mockUsers[3], // Sarah Williams bez avatara
          mockUsers[4], // Tech Lead bez avatara
          mockUsers[5], // Emma Wilson z avatarem
        ],
        dueDate: new Date('2025-02-13'),
        board: 'board-1',
        checklists: [
          {
            name: 'Funkcjonalności',
            items: [
              { item: 'Logowanie Google', isCompleted: false },
              { item: 'Logowanie GitHub', isCompleted: false },
            ],
          },
        ],
        attachments: [
          {
            id: 'att1',
            filename: 'auth-diagram.png',
            path: '/attachments/auth-diagram.png',
          },
        ],
      },
      {
        id: 'task-2',
        title: 'Zaprojektować stronę główną',
        description: 'Stworzyć makietę strony głównej w Figmie',
        status: 'Do zrobienia',
        priority: TaskPriority.Medium,
        assignees: [mockUsers[5]], // Emma Wilson z avatarem
        dueDate: new Date('2025-02-12'),
        board: 'board-1',
        checklists: [
          {
            name: 'Design',
            items: [{ item: 'Mobile', isCompleted: true }],
          },
        ],
      },
      {
        id: 'task-3',
        title: 'Optymalizacja wydajności',
        description: 'Zoptymalizować ładowanie obrazów i czcionek',
        status: 'Backlog',
        priority: TaskPriority.Low,
        assignees: [mockUsers[6]], // David bez avatara
        dueDate: new Date('2025-02-14'),
        board: 'board-1',
      },
      {
        id: 'task-4',
        title: 'Integracja z API',
        description: 'Połączyć frontend z nowym API',
        status: 'W trakcie',
        priority: TaskPriority.High,
        assignees: [
          mockUsers[0], // John Doe z avatarem
          mockUsers[4], // Tech Lead bez avatara
        ],
        dueDate: new Date('2024-04-02'),
        board: 'board-1',
        attachments: [
          {
            id: 'att2',
            filename: 'api-docs.pdf',
            path: '/attachments/api-docs.pdf',
          },
        ],
      },
      {
        id: 'task-5',
        title: 'Testy E2E',
        description: 'Napisać testy end-to-end dla głównych funkcjonalności',
        status: 'Do testów',
        assignees: [mockUsers[8]], // DevOps Engineer bez avatara
        dueDate: new Date('2024-04-10'),
        board: 'board-1',
        checklists: [
          {
            name: 'Testy',
            items: [
              { item: 'Logowanie', isCompleted: false },
              { item: 'Rejestracja', isCompleted: false },
              { item: 'Dashboard', isCompleted: false },
            ],
          },
        ],
      },
      {
        id: 'task-6',
        title: 'Dokumentacja API',
        description: 'Przygotować dokumentację API w Swagger',
        status: 'Zakończone',
        priority: TaskPriority.Low,
        assignees: [mockUsers[4]], // Tech Lead
        dueDate: new Date('2024-04-15'),
        board: 'board-1',
      },
      {
        id: 'task-7',
        title: 'Analiza bezpieczeństwa',
        description: 'Przeprowadzić audyt bezpieczeństwa aplikacji',
        status: 'W trakcie',
        priority: TaskPriority.High,
        assignees: [mockUsers[8]], // DevOps Engineer
        dueDate: new Date('2024-04-20'),
        board: 'board-1',
        checklists: [
          {
            name: 'Audyt',
            items: [
              { item: 'Analiza kodu', isCompleted: true },
              { item: 'Testy penetracyjne', isCompleted: false },
            ],
          },
        ],
      },
      {
        id: 'task-8',
        title: 'Optymalizacja SEO',
        description: 'Poprawić SEO strony głównej',
        status: 'Backlog',
        assignees: [mockUsers[0]], // Frontend Dev
        dueDate: new Date('2024-04-08'),
        board: 'board-1',
      },
      {
        id: 'task-9',
        title: 'Responsywność',
        description: 'Sprawdzić i poprawić RWD na wszystkich podstronach',
        status: 'Do testów',
        assignees: [mockUsers[0]], // Frontend Dev
        dueDate: new Date('2024-04-12'),
        board: 'board-1',
      },
      {
        id: 'task-10',
        title: 'Monitoring',
        description: 'Wdrożyć system monitoringu aplikacji',
        status: 'Zakończone',
        assignees: [mockUsers[0]], // DevOps Engineer
        dueDate: new Date('2024-04-25'),
        board: 'board-1',
        attachments: [
          {
            id: 'att3',
            filename: 'monitoring-plan.pdf',
            path: '/attachments/monitoring-plan.pdf',
          },
        ],
      },
    ],
  },
];

export function getMockGroup(id: string): Group | undefined {
  return mockGroups.find((group) => group.id === id);
}

export function getMockBoardsByGroup(groupId: string): Board[] {
  return mockBoards.filter((board) => board.group === groupId);
}
