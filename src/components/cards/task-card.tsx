import React, { useMemo, useState, useEffect } from 'react';
import { Task, TaskPriority } from '@/types/task';
import { Board } from '@/types/board';
import { Avatar } from '@/components/ui/avatar';
import { CheckSquare, Paperclip, Calendar } from 'lucide-react';
import { TaskDialog } from '../dialogs/TaskDialog';

function getDaysUntil(date: Date | string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  return `${diffDays} days`;
}

function getDateStatusClasses(dueDate: Date | string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dueDate);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate.getTime() < today.getTime()) {
    return 'bg-red-100 text-red-700';
  } else {
    return 'bg-gray-50 text-gray-600';
  }
}

function getPriorityColor(priority?: TaskPriority): string {
  switch (priority) {
    case TaskPriority.High:
      return 'bg-red-100 text-red-700';
    case TaskPriority.Medium:
      return 'bg-yellow-100 text-yellow-700';
    case TaskPriority.Low:
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

interface TaskCardProps {
  task: Task;
  board: Board;
}

export const TaskCard = React.memo(({ task, board }: TaskCardProps) => {
  const [open, setOpen] = useState(false);

  const handleUpdateTask = async (updatedTask: Partial<Task>) => {
    try {
      console.log('Updating task:', { ...task, ...updatedTask });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const MAX_VISIBLE_ASSIGNEES = 5;

  const visibleAssignees =
    task.assignees?.slice(0, MAX_VISIBLE_ASSIGNEES) || [];
  const remainingCount = Math.max(
    0,
    (task.assignees?.length || 0) - MAX_VISIBLE_ASSIGNEES
  );

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white p-3 rounded-cb-base shadow-sm select-none relative hover:shadow-md transition-shadow min-h-[140px] flex flex-col cursor-pointer"
      >
        <div className="flex justify-between items-center mb-2">
          {task.priority && (
            <span
              className={`px-2 py-1 rounded-cb-sm text-xs font-medium ${getPriorityColor(
                task.priority as TaskPriority
              )}`}
            >
              {task.priority}
            </span>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span
                className={`px-2 py-0.5 rounded-cb-sm ${getDateStatusClasses(
                  task.dueDate
                )}`}
              >
                {getDaysUntil(task.dueDate)}
              </span>
            </div>
          )}
        </div>

        <h4 className="font-semibold text-base truncate mb-4">{task.title}</h4>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-2">
            {task.checklists && task.checklists.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <CheckSquare className="w-4 h-4" />
                <span>{task.checklists.length}</span>
              </div>
            )}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Paperclip className="w-4 h-4" />
                <span>{task.attachments.length}</span>
              </div>
            )}
          </div>

          <div className="flex flex-row-reverse -space-x-1 space-x-reverse items-center">
            {remainingCount > 0 && (
              <div className="relative z-0 ml-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 border border-white">
                  {remainingCount > 99 ? '>99' : `+${remainingCount}`}
                </div>
              </div>
            )}
            {visibleAssignees.map((assignee) => (
              <div
                key={assignee.id}
                className="relative hover:z-10"
                style={{
                  zIndex:
                    visibleAssignees.length -
                    visibleAssignees.indexOf(assignee),
                }}
              >
                <Avatar
                  name={assignee.name}
                  image={assignee.avatar}
                  size="sm"
                  columnColor={columnColor}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <TaskDialog
        mode="view"
        task={task}
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleUpdateTask}
        initialGroups={[]}
        initialBoards={[board]}
      />
    </>
  );
});

TaskCard.displayName = 'TaskCard';
