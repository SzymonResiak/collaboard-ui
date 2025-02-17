import { Board } from '@/types/board';
import { UserDto } from '@/types/user';
import { TaskPriority } from '@/types/task';

// Przykładowe avatary (opcjonalne)
export const mockUsers: UserDto[] = [
  { id: 'user-1', name: 'John Doe' },
  { id: 'user-2', name: 'Jane Smith' },
  { id: 'user-3', name: 'Mike Johnson' },
  { id: 'user-4', name: 'Sarah Williams' },
  { id: 'user-5', name: 'Tech Lead' },
  { id: 'user-6', name: 'Emma Wilson' },
  {
    id: 'user-7',
    name: 'DevOpsEngineerWyższegostopniaozamiłowaniachdolinuxa oraz TempleOS. User ten jest niezdolny do pracy',
  },
  { id: 'user-8', name: 'Frontend Dev' },
  {
    id: 'user-9',
    name: 'DevOps Engineer Wyższego stopnia o zamiłowaniach do linuxa oraz TempleOS. User ten jest niezdolny do pracy',
  },
];

export const mockCurrentUser = {
  id: '1',
  name: 'John Doe',
  memberCode: '928811',
  avatar: undefined,
};

export const getMockBoard = (name: string): Board => ({
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
      board: name,
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
      board: name,
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
      board: name,
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
      board: name,
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
      board: name,
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
      board: name,
    },
    {
      id: 'task-7',
      title: 'Analiza bezpieczeństwa',
      description: 'Przeprowadzić audyt bezpieczeństwa aplikacji',
      status: 'W trakcie',
      priority: TaskPriority.High,
      assignees: [mockUsers[8]], // DevOps Engineer
      dueDate: new Date('2024-04-20'),
      board: name,
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
      priority: TaskPriority.Medium,
      assignees: [mockUsers[7]], // Frontend Dev
      dueDate: new Date('2024-04-08'),
      board: name,
    },
    {
      id: 'task-9',
      title: 'Responsywność',
      description: 'Sprawdzić i poprawić RWD na wszystkich podstronach',
      status: 'Do testów',
      priority: TaskPriority.High,
      assignees: [mockUsers[7]], // Frontend Dev
      dueDate: new Date('2024-04-12'),
      board: name,
    },
    {
      id: 'task-10',
      title: 'Monitoring',
      description: 'Wdrożyć system monitoringu aplikacji',
      status: 'Zakończone',
      priority: TaskPriority.Medium,
      assignees: [mockUsers[8]], // DevOps Engineer
      dueDate: new Date('2024-04-25'),
      board: name,
      attachments: [
        {
          id: 'att3',
          filename: 'monitoring-plan.pdf',
          path: '/attachments/monitoring-plan.pdf',
        },
      ],
    },
  ],
});
