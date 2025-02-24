export interface Task {
  id?: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignees: string[];
  checklists?: Checklist[];
  attachments?: Attachment[];
  canEdit?: boolean;
  status: string;
  board: string;
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
