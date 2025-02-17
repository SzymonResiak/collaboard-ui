import { CreateTaskButton } from './CreateTaskButton';

export function Navbar() {
  return (
    <nav className="h-16 border-b px-4 flex items-center justify-between">
      {/* Inne elementy nawigacji */}
      <CreateTaskButton />
    </nav>
  );
}
