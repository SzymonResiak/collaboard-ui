import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TaskDialog } from '@/components/dialogs/TaskDialog';
import { TaskOutputDto } from '@/types/api-types';

export function CreateTaskButton() {
  const [open, setOpen] = useState(false);

  const handleCreateTask = async (task: Partial<TaskOutputDto>) => {
    try {
      console.log('New task created:', {
        id: `task-${Date.now()}`,
        status: 'TODO',
        createdBy: 'current-user',
        board: 'current-board',
        ...task,
      });
      // TODO: W przyszłości implementacja API
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Nowe zadanie</Button>

      <TaskDialog
        mode="create"
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreateTask}
      />
    </>
  );
}
