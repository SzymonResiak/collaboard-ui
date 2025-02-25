import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TaskFields } from './TaskFields';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { Paperclip, Check } from 'lucide-react';
import { Checklist, ChecklistItem } from '@/types/task';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash';
import { Board } from '@/types/board';
import { useBoardsData } from '@/hooks/useBoardsData';

type TaskDialogMode = 'create' | 'view' | 'edit';

interface TaskDialogProps {
  mode: TaskDialogMode;
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: Partial<Task>) => void;
  initialBoards: Board[];
  initialGroups?: {
    id: string;
    name: string;
    boards: Board[];
  }[];
}

export function TaskDialog({
  mode,
  task,
  open,
  onOpenChange,
  onSubmit,
  initialBoards = [],
  initialGroups = [],
}: TaskDialogProps) {
  const [isEditing, setIsEditing] = useState(
    mode === 'edit' || mode === 'create'
  );

  const [taskMode, setTaskMode] = useState<'OWN' | 'GROUP'>('OWN');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

  const { getAvailableBoards, getBoardMembers, getGroups } = useBoardsData();

  const availableGroups = useMemo(() => {
    return getGroups();
  }, [getGroups]);

  const availableBoards = useMemo(() => {
    return getAvailableBoards(taskMode, selectedGroup || undefined);
  }, [taskMode, selectedGroup, getAvailableBoards]);

  const availableMembers = useMemo(() => {
    if (!selectedBoard) return [];
    return getBoardMembers(selectedBoard);
  }, [selectedBoard, getBoardMembers]);

  const getInitialData = () => {
    if (!task) {
      return {
        title: '',
        description: '',
        assignees: [],
        checklists: [],
        attachments: [],
      };
    }
    return {
      ...task,
      assignees: [...task.assignees],
      checklists:
        task.checklists?.map((checklist: Checklist) => ({
          ...checklist,
          items: checklist.items.map((item: ChecklistItem) => ({ ...item })),
        })) || [],
      attachments: [...(task.attachments || [])],
    };
  };

  const [formData, setFormData] = useState<Partial<Task>>(getInitialData());

  useEffect(() => {
    if (open) {
      setIsEditing(mode === 'edit' || mode === 'create');
      setFormData(getInitialData());
      setValidationErrors({
        title: false,
        checklistNames: [],
      });
    }
  }, [open, mode]);

  const canEdit = mode === 'create' || (task?.canEdit && mode === 'view');

  const title = {
    create: 'Create new task',
    view: 'Task details',
    edit: 'Edit task',
  }[mode];

  const [validationErrors, setValidationErrors] = useState<{
    title: boolean;
    checklistNames: number[];
  }>({
    title: false,
    checklistNames: [],
  });

  const handleFieldChange = (field: keyof Task, value: unknown) => {
    if (field === 'title') {
      setValidationErrors((prev) => ({ ...prev, title: false }));
    }

    if (field === 'checklists') {
      setValidationErrors((prev) => ({ ...prev, checklistNames: [] }));
    }

    setFormData((prev: Partial<Task>) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData(getInitialData());
    setIsEditing(false);
    onOpenChange(false);
  };

  const debouncedUpdateCache = useCallback(
    debounce((path: string, data: unknown) => {
      // updateCache(path, data);
    }, 500),
    []
  );

  const updateLocalBoards = useCallback(
    (newTask: Task) => {
      const boardToUpdate = initialBoards.find(
        (board) => board.id === selectedBoard
      );
      if (!boardToUpdate) return;

      const updatedBoard = {
        ...boardToUpdate,
        tasks: [newTask, ...boardToUpdate.tasks],
      };

      const cachedBoards = initialBoards.map((board) =>
        board.id === selectedBoard ? updatedBoard : board
      );

      debouncedUpdateCache('/api/boards', cachedBoards);

      const orderKey = `board-order-${selectedBoard}`;
      const currentOrder = JSON.parse(localStorage.getItem(orderKey) || '{}');

      const firstColumnName = boardToUpdate.columns[0].name;

      const updatedOrder = {
        ...currentOrder,
        [firstColumnName]: [
          newTask.id,
          ...(currentOrder[firstColumnName] || []),
        ],
      };

      localStorage.setItem(orderKey, JSON.stringify(updatedOrder));
    },
    [initialBoards, selectedBoard, debouncedUpdateCache]
  );

  const handleSubmit = async () => {
    const newErrors = {
      title: !formData.title?.trim(),
      checklistNames:
        formData.checklists
          ?.map((checklist: Checklist, index: number): number =>
            !checklist.name?.trim() ? index : -1
          )
          .filter((index: number): boolean => index !== -1) || [],
    };

    setValidationErrors(newErrors);

    if (newErrors.title || newErrors.checklistNames.length > 0) {
      return;
    }

    handleClose();

    try {
      const { ...restData } = formData;
      const taskData = {
        ...restData,
        board: selectedBoard as string,
        status: selectedBoardData?.columns[0].name as string,
        assignees: taskMode === 'OWN' ? [] : formData.assignees || [],
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await response.json();

      updateLocalBoards(createdTask);

      if (onSubmit) {
        onSubmit(createdTask);
      }

      setTimeout(() => {
        // Assuming refreshBoards is called elsewhere in the code
      }, 500);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSave = useMemo(() => {
    if (mode === 'create') {
      if (availableBoards.length === 0) return false;
      if (!selectedBoard) return false;
      if (taskMode === 'GROUP' && !selectedGroup) return false;
    }

    if (!formData.title?.trim()) return false;
    if (formData.checklists?.some((checklist) => !checklist.name?.trim()))
      return false;

    return true;
  }, [
    mode,
    availableBoards.length,
    selectedBoard,
    selectedGroup,
    taskMode,
    formData,
  ]);

  const selectedBoardData = useMemo(() => {
    return initialBoards.find((board) => board.id === selectedBoard);
  }, [initialBoards, selectedBoard]);

  useEffect(() => {
    if (taskMode === 'GROUP' && availableGroups.length === 1) {
      setSelectedGroup(availableGroups[0].id);
    } else if (taskMode === 'OWN' && initialBoards.length === 1) {
      setSelectedBoard(initialBoards[0].id);
    }
  }, [taskMode, availableGroups, initialBoards]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col rounded-cb overflow-visible outline-none focus:outline-none focus-visible:outline-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 flex-1 overflow-y-auto px-2">
          {mode === 'create' && (
            <>
              <div className="flex items-center justify-center">
                <div className="bg-gray-100 p-1 rounded-full flex">
                  <button
                    className={cn(
                      'w-24 py-2 text-sm font-medium transition-colors flex justify-center items-center',
                      'first:rounded-l-full last:rounded-r-full',
                      taskMode === 'OWN'
                        ? 'bg-black text-white'
                        : 'bg-transparent text-black hover:bg-gray-200'
                    )}
                    onClick={() => setTaskMode('OWN')}
                  >
                    OWN
                  </button>
                  <button
                    className={cn(
                      'w-24 py-2 text-sm font-medium transition-colors flex justify-center items-center',
                      'first:rounded-l-full last:rounded-r-full',
                      taskMode === 'GROUP'
                        ? 'bg-black text-white'
                        : 'bg-transparent text-black hover:bg-gray-200'
                    )}
                    onClick={() => setTaskMode('GROUP')}
                  >
                    GROUP
                  </button>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                {taskMode === 'GROUP' && (
                  <div className="flex-1 space-y-2 min-w-0">
                    <Label>Group</Label>
                    <Select
                      value={selectedGroup || ''}
                      onValueChange={setSelectedGroup}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex-1 space-y-2 min-w-0">
                  <Label>Board</Label>
                  <Select
                    value={selectedBoard || ''}
                    onValueChange={setSelectedBoard}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBoards.map((board) => (
                        <SelectItem key={board.id} value={board.id}>
                          {board.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <TaskFields
            task={formData as Task}
            isEditing={isEditing}
            onChange={handleFieldChange}
            validationErrors={validationErrors}
            availableAssignees={availableMembers}
            mode={taskMode}
          />
        </div>

        <div className="flex justify-between items-center gap-2 pt-4 border-t">
          {isEditing && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newChecklists = [...(formData?.checklists || [])];
                  newChecklists.push({
                    name: '',
                    items: [],
                  });
                  handleFieldChange('checklists', newChecklists);
                }}
                className="h-8 w-8"
                title="Add Checklist"
              >
                <div className="w-4 h-4 flex items-center justify-center rounded border border-current">
                  <Check className="w-3 h-3" />
                </div>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const newAttachments = [...(formData?.attachments || [])];
                    newAttachments.push({
                      id: `att-${Date.now()}`, // API should generate unique id
                      filename: file.name,
                      path: URL.createObjectURL(file),
                    });
                    handleFieldChange('attachments', newAttachments);
                  }
                  e.target.value = '';
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8"
                title="Add Attachment"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-2 ml-auto">
            {mode === 'view' && canEdit && !isEditing && (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
            {isEditing && (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSave || availableBoards.length === 0}
                >
                  Save
                </Button>
              </>
            )}
            {!isEditing && (
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
