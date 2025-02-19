'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useMemo, useEffect } from 'react';
import { Board } from '@/types/board';
import { MultiSelect } from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Edit2, Trash2, Paintbrush } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { isUserBoardAdmin } from '@/lib/utils';
import { Group } from '@/types/group';
import { useCurrentUser } from '@/hooks/useCurrentUser';

type BoardDialogMode = 'create' | 'view' | 'edit';
type BoardType = 'PERSONAL' | 'GROUP';

interface Column {
  name: string;
  color: string;
  isEditing?: boolean;
}

interface BoardDialogProps {
  mode: BoardDialogMode;
  board?: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: Partial<Board>) => void;
}

const DEFAULT_COLUMNS = [{ name: 'Created', color: '#E5E7EB' }];
const MAX_COLUMNS = 5;

const COLORS = [
  '#FDA4AF', // red
  '#FCA5A5', // rose
  '#F9A8D4', // pink
  '#C4B5FD', // purple
  '#93C5FD', // blue
  '#6EE7B7', // green
  '#FCD34D', // yellow
];

interface MoveTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: Column[];
  sourceColumn: Column;
  onColumnSelect: (targetColumnId: string) => void;
}

function MoveTasksDialog({
  open,
  onOpenChange,
  columns,
  sourceColumn,
  onColumnSelect,
}: MoveTasksDialogProps) {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  if (!sourceColumn) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Move tasks</AlertDialogTitle>
          <AlertDialogDescription>
            Choose column to move existing tasks to.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            {columns
              .filter((col) => col.name !== sourceColumn.name)
              .map((column) => (
                <button
                  key={column.name}
                  className={cn(
                    'w-full p-3 text-left rounded-md transition-colors',
                    selectedColumn === column.name
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  )}
                  onClick={() => setSelectedColumn(column.name)}
                >
                  {column.name}
                </button>
              ))}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setSelectedColumn(null)}>
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={!selectedColumn}
            onClick={() => {
              if (selectedColumn) {
                onColumnSelect(selectedColumn);
                setSelectedColumn(null);
              }
            }}
          >
            Save
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function BoardDialog({
  mode,
  board,
  open,
  onOpenChange,
  onSubmit,
}: BoardDialogProps) {
  const [isEditing, setIsEditing] = useState(
    mode === 'create' || mode === 'edit'
  );
  const [boardType, setBoardType] = useState<BoardType>('PERSONAL');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    columns: false,
  });

  const getInitialData: () => Partial<Board> = () => {
    if (!board) {
      return {
        name: '',
        description: '',
        columns: DEFAULT_COLUMNS.map((col) => ({ ...col, isEditing: false })),
        color: COLORS[0],
        admins: [],
        type: boardType,
        groupId: selectedGroup,
      };
    }
    return {
      ...board,
      columns: board.columns.map((col) => ({ ...col, isEditing: false })),
      admins: [...board.admins],
    };
  };

  const [formData, setFormData] = useState<Partial<Board>>(getInitialData());
  const [moveTasksDialog, setMoveTasksDialog] = useState<{
    open: boolean;
    column?: Column;
  }>({ open: false });

  const [activeColorPicker, setActiveColorPicker] = useState<number | null>(
    null
  );

  const [groups, setGroups] = useState<Group[]>([]);

  const handleFieldChange = (field: keyof Board, value: unknown) => {
    setValidationErrors((prev) => ({ ...prev, [field]: false }));
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = () => {
    const newErrors = {
      name: !formData.name?.trim(),
      columns: !formData.columns?.length,
    };

    setValidationErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
      handleClose();
    }
  };

  const availableUsers = useMemo(() => {
    if (boardType === 'PERSONAL') {
      return [];
    }
    if (selectedGroup) {
      const group = groups.find((g) => g.id === selectedGroup);
      return group?.members || [];
    }
    return [];
  }, [boardType, selectedGroup, groups]);

  const canEdit =
    mode === 'create' || (board && isUserBoardAdmin(board, useCurrentUser));
  const canSave = useMemo(() => {
    if (!board) return false;

    if (mode === 'create') {
      return !!formData.name?.trim() && !!formData.color;
    }

    if (mode === 'edit') {
      return (
        !!formData.name?.trim() &&
        !!formData.color &&
        (formData.name !== board.name ||
          formData.description !== board.description ||
          formData.color !== board.color ||
          formData.type !== board.type ||
          formData.groupId !== board.groupId)
      );
    }

    return false;
  }, [mode, formData, board]);

  const title = {
    create: 'Create new board',
    view: 'Board details',
    edit: 'Edit board',
  }[mode];

  const handleDeleteColumn = (columnToDelete: Column) => {
    const tasksInColumn = board?.tasks?.filter(
      (task) => task.status === columnToDelete.name
    ).length;

    if (tasksInColumn && formData.columns!.length > 1) {
      setMoveTasksDialog({ open: true, column: columnToDelete });
    } else if (!tasksInColumn) {
      const newColumns = formData.columns!.filter(
        (col) => col.name !== columnToDelete.name
      );
      handleFieldChange('columns', newColumns);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeColorPicker !== null) {
        setActiveColorPicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeColorPicker]);

  useEffect(() => {
    if (open) {
      setFormData(getInitialData());
    }
  }, [open, board, boardType, selectedGroup]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        if (!response.ok) throw new Error('Failed to fetch groups');
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    if (open) {
      fetchGroups();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col overflow-visible">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 flex-1 overflow-y-auto">
          {mode === 'create' && (
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 p-1 rounded-full flex">
                <button
                  className={cn(
                    'w-24 py-2 text-sm font-medium transition-colors flex justify-center items-center',
                    'first:rounded-l-full last:rounded-r-full',
                    boardType === 'PERSONAL'
                      ? 'bg-black text-white'
                      : 'bg-transparent text-black hover:bg-gray-200'
                  )}
                  onClick={() => {
                    setBoardType('PERSONAL');
                    setSelectedGroup(null);
                  }}
                >
                  PERSONAL
                </button>
                <button
                  className={cn(
                    'w-24 py-2 text-sm font-medium transition-colors flex justify-center items-center',
                    'first:rounded-l-full last:rounded-r-full',
                    boardType === 'GROUP'
                      ? 'bg-black text-white'
                      : 'bg-transparent text-black hover:bg-gray-200'
                  )}
                  onClick={() => setBoardType('GROUP')}
                >
                  GROUP
                </button>
              </div>
            </div>
          )}

          {boardType === 'GROUP' && mode === 'create' && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Group
                <span className="text-black-500">*</span>
              </Label>
              <Select
                value={selectedGroup || ''}
                onValueChange={setSelectedGroup}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Name *"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              error={validationErrors.name}
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="bg-white"
            />

            <MultiSelect
              label="Board Administrators"
              selectedUsers={formData.admins || []}
              onChange={(users) => handleFieldChange('admins', users)}
              options={availableUsers}
              disabled={boardType === 'PERSONAL'}
            />

            <div className="space-y-2">
              <Label>Columns *</Label>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {formData.columns?.map((column, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      >
                        <td className="p-3">
                          {column.isEditing ? (
                            <input
                              type="text"
                              value={column.name}
                              autoFocus
                              className="w-full border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:border-black px-0"
                              onChange={(e) => {
                                const newColumns = [...formData.columns!];
                                newColumns[index] = {
                                  ...newColumns[index],
                                  name: e.target.value,
                                };
                                handleFieldChange('columns', newColumns);
                              }}
                              onBlur={() => {
                                const newColumns = [...formData.columns!];
                                newColumns[index] = {
                                  ...newColumns[index],
                                  isEditing: false,
                                };
                                handleFieldChange('columns', newColumns);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                            />
                          ) : (
                            column.name
                          )}
                        </td>
                        <td className="p-3 w-32">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() => {
                                const newColumns = [...formData.columns!];
                                newColumns[index] = {
                                  ...newColumns[index],
                                  isEditing: true,
                                };
                                handleFieldChange('columns', newColumns);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <div className="relative">
                              <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveColorPicker(
                                    activeColorPicker === index ? null : index
                                  );
                                }}
                              >
                                <Paintbrush
                                  className="w-4 h-4"
                                  color="black"
                                  fill={column.color || '#E5E7EB'}
                                  stroke="currentColor"
                                  strokeWidth={2}
                                />
                              </button>
                              {activeColorPicker === index && (
                                <div
                                  className="absolute right-0 top-8 bg-white rounded-md shadow-lg p-2 z-10"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex gap-1">
                                    {COLORS.map((color) => (
                                      <button
                                        key={color}
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                          const newColumns = [
                                            ...formData.columns!,
                                          ];
                                          newColumns[index] = {
                                            ...newColumns[index],
                                            color,
                                          };
                                          handleFieldChange(
                                            'columns',
                                            newColumns
                                          );
                                          setActiveColorPicker(null);
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <button
                              className={cn(
                                'p-1 hover:bg-gray-100 rounded',
                                formData.columns!.length === 1 &&
                                  'cursor-not-allowed opacity-50'
                              )}
                              onClick={() => handleDeleteColumn(column)}
                              disabled={formData.columns!.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {Array.from(
                      { length: MAX_COLUMNS - (formData.columns?.length || 0) },
                      (_, i) => (
                        <tr
                          key={`empty-${i}`}
                          className={
                            (formData.columns?.length || 0) + (i % 2) === 0
                              ? 'bg-gray-50'
                              : 'bg-white'
                          }
                        >
                          <td colSpan={2} className="p-3 text-gray-400">
                            Empty slot
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              {formData.columns?.length < MAX_COLUMNS && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const newColumns = [...(formData.columns || [])];
                    newColumns.push({ name: '', color: '#E5E7EB' });
                    handleFieldChange('columns', newColumns);
                  }}
                >
                  + Add Column
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Board Color</Label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      'w-8 h-8 rounded-full transition-transform',
                      formData.color === color && 'scale-125'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handleFieldChange('color', color)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          {mode === 'view' && canEdit && !isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
          {isEditing && (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!canSave}>
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

        <MoveTasksDialog
          open={moveTasksDialog.open}
          onOpenChange={(open) => setMoveTasksDialog({ open })}
          columns={formData.columns || []}
          sourceColumn={moveTasksDialog.column!}
          onColumnSelect={(targetColumnName) => {
            // Tutaj będzie logika przenoszenia tasków
            const newColumns = formData.columns!.filter(
              (col) => col.name !== moveTasksDialog.column!.name
            );
            handleFieldChange('columns', newColumns);
            setMoveTasksDialog({ open: false });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
