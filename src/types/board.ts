import { Task } from './task';

export interface Board {
  id: string;
  name: string;
  description: string;
  color: string;
  columns: Column[];
  admins: string[];
  group?: string;
  favourite: boolean;
  tasks: Task[];
}

export interface Column {
  name: string;
  color?: string;
  tasks?: Task[];
}

export interface BoardOrder {
  [columnId: string]: string[];
}
