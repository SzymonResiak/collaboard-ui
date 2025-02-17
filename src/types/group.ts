export interface Group {
  id: string;
  name: string;
  description?: string;
  favourite: boolean;
  members: string[];
  admins: string[];
}
