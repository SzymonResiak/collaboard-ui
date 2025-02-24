export interface ChecklistItem {
  item: string;
  isCompleted: boolean;
}

export interface Checklist {
  name: string;
  items: ChecklistItem[];
}

export interface Attachment {
  id: string;
  filename: string;
  path: string;
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assignees: string[];
  dueDate: Date;
  board: string;
  checklists?: Checklist[];
  attachments?: Attachment[];
  priority?: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  name: string;
  color: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  color: string;
  columns: Column[];
  admins: string[];
  group: string;
  favourite: boolean;
  tasks: Task[];
}

export interface BoardOrder {
  [columnId: string]: string[]; // tablica ID tasków w kolejności
}
