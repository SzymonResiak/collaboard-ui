import { UserDto } from './user';

export interface Task {
  id: string;
  title: string;
  description: string;
  canEdit?: boolean;
  status: string;
  assignees: UserDto[];
  dueDate: Date;
  board: string;
  checklists?: Checklist[];
  attachments?: Attachment[];
  priority?: TaskPriority;
}

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
