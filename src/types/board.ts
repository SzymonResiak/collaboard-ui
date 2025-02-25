import { Task } from './task';

export interface Member {
  id: string;
  name: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  color: string;
  columns: Column[];
  admins: Member[];
  members: Member[];
  group?: Group;
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
