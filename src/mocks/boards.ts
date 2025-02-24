import { Board, TaskPriority } from '@/types/board';

export const getMockBoard = (name: string): Board => ({
  id: 'board-1',
  name: decodeURIComponent(name),
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
      title:
        'Zaimplementowaćlogowanielogowanialogowanialogowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania logowania',
      description:
        'Dodać logowanie przez Google i GitHub i Google i GitHub i GitHub i 2Google iGitHubiGooglei GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google i GitHub i Google',
      priority: TaskPriority.Medium,
      status: 'Do zrobienia',
      assignees: [
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
        'John',
        'Alice Smith',
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
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-15'),
    },
    {
      id: 'task-2',
      title: 'Zaprojektować stronę główną',
      description: 'Stworzyć makietę strony głównej w Figmie',
      status: 'Do zrobienia',
      priority: TaskPriority.Medium,
      assignees: ['Emma Wilson'],
      dueDate: new Date('2025-02-12'),
      board: name,
      checklists: [
        {
          name: 'Design',
          items: [{ item: 'Mobile', isCompleted: true }],
        },
      ],
      createdAt: new Date('2024-03-02'),
      updatedAt: new Date('2024-03-16'),
    },
    {
      id: 'task-3',
      title: 'Optymalizacja wydajności',
      description: 'Zoptymalizować ładowanie obrazów i czcionek',
      status: 'Backlog',
      priority: TaskPriority.Low,
      assignees: ['Tech Team'],
      dueDate: new Date('2025-02-14'),
      board: name,
      createdAt: new Date('2024-03-03'),
      updatedAt: new Date('2024-03-17'),
    },
    {
      id: 'task-4',
      title: 'Integracja z API',
      description: 'Połączyć frontend z nowym API',
      status: 'W trakcie',
      priority: TaskPriority.High,
      assignees: ['John', 'Tech Team'],
      dueDate: new Date('2024-04-02'),
      board: name,
      attachments: [
        {
          id: 'att2',
          filename: 'api-docs.pdf',
          path: '/attachments/api-docs.pdf',
        },
      ],
      createdAt: new Date('2024-03-04'),
      updatedAt: new Date('2024-03-18'),
    },
    {
      id: 'task-5',
      title: 'Testy E2E',
      description: 'Napisać testy end-to-end dla głównych funkcjonalności',
      status: 'Do testów',
      assignees: ['Test Team'],
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
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-19'),
    },
    {
      id: 'task-6',
      title: 'Dokumentacja API',
      description: 'Przygotować dokumentację API w Swagger',
      status: 'Zakończone',
      priority: TaskPriority.Low,
      assignees: ['Tech Team'],
      dueDate: new Date('2024-04-15'),
      board: name,
      createdAt: new Date('2024-03-06'),
      updatedAt: new Date('2024-03-20'),
    },
    {
      id: 'task-7',
      title: 'Analiza bezpieczeństwa',
      description: 'Przeprowadzić audyt bezpieczeństwa aplikacji',
      status: 'W trakcie',
      priority: TaskPriority.High,
      assignees: ['Security Team'],
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
      createdAt: new Date('2024-03-07'),
      updatedAt: new Date('2024-03-21'),
    },
    {
      id: 'task-8',
      title: 'Optymalizacja SEO',
      description: 'Poprawić SEO strony głównej',
      status: 'Backlog',
      priority: TaskPriority.Medium,
      assignees: ['Marketing Team'],
      dueDate: new Date('2024-04-08'),
      board: name,
      createdAt: new Date('2024-03-08'),
      updatedAt: new Date('2024-03-22'),
    },
    {
      id: 'task-9',
      title: 'Responsywność',
      description: 'Sprawdzić i poprawić RWD na wszystkich podstronach',
      status: 'Do testów',
      priority: TaskPriority.High,
      assignees: ['Frontend Team'],
      dueDate: new Date('2024-04-12'),
      board: name,
      createdAt: new Date('2024-03-09'),
      updatedAt: new Date('2024-03-23'),
    },
    {
      id: 'task-10',
      title: 'Monitoring',
      description: 'Wdrożyć system monitoringu aplikacji',
      status: 'Zakończone',
      priority: TaskPriority.Medium,
      assignees: ['DevOps Team'],
      dueDate: new Date('2024-04-25'),
      board: name,
      attachments: [
        {
          id: 'att3',
          filename: 'monitoring-plan.pdf',
          path: '/attachments/monitoring-plan.pdf',
        },
      ],
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-24'),
    },
  ],
});
