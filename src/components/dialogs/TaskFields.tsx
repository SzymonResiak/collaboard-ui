import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import { Avatar } from '@/components/ui/avatar';
import { mockUsers } from '@/mocks/boards';
import { truncateName } from '@/lib/utils';
import { CheckSquare, Paperclip, X, Trash2 } from 'lucide-react';
import React from 'react';
import { Task } from '@/types/task';
import { Checklist } from '@/types/task';

interface TaskFieldsProps {
  task?: Task;
  isEditing: boolean;
  onChange?: (field: keyof Task, value: unknown) => void;
  validationErrors?: {
    title: boolean;
    checklistNames: number[];
  };
}

interface ChecklistSectionProps {
  checklist: Checklist;
  index: number;
  task: Task;
  onChange: (field: keyof Task, value: unknown) => void;
  validationErrors?: TaskFieldsProps['validationErrors'];
}

function ChecklistSection({
  checklist,
  index,
  task,
  onChange,
  validationErrors,
}: ChecklistSectionProps) {
  React.useEffect(() => {
    if (
      checklist.items.length === 0 ||
      checklist.items[checklist.items.length - 1].item !== ''
    ) {
      const newChecklists = [...(task.checklists || [])];
      newChecklists[index].items.push({
        item: '',
        isCompleted: false,
      });
      onChange?.('checklists', newChecklists);
    }
  }, [checklist.items, index, task.checklists, onChange]);

  return (
    <div
      key={index}
      className="border border-gray-200 rounded-md p-3 space-y-3 bg-white"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={checklist.name}
          onChange={(e) => {
            const newChecklists = [...(task.checklists || [])];
            newChecklists[index].name = e.target.value;
            onChange?.('checklists', newChecklists);
          }}
          className={`text-sm font-medium w-full border-0 border-b border-transparent hover:border-gray-200 focus:border-gray-300 focus:ring-0 p-0 pb-1 ${
            validationErrors?.checklistNames.includes(index)
              ? 'border-red-200 focus:border-red-300'
              : ''
          }`}
          placeholder="Checklist name... *"
        />
        <button
          onClick={() => {
            const newChecklists = [...(task.checklists || [])];
            newChecklists.splice(index, 1);
            onChange?.('checklists', newChecklists);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {checklist.items.map((item, itemIndex) => (
          <div key={itemIndex} className="flex items-center gap-2 text-sm">
            <div
              onClick={() => {
                const newChecklists = [...(task.checklists || [])];
                newChecklists[index].items[itemIndex].isCompleted =
                  !item.isCompleted;
                onChange?.('checklists', newChecklists);
              }}
              className={`w-4 h-4 flex items-center justify-center rounded border border-gray-300 cursor-pointer ${
                item.isCompleted ? 'bg-white border-gray-300' : ''
              }`}
            >
              {item.isCompleted && (
                <svg
                  className="w-3 h-3 text-black"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 6L5 8.5L9.5 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <input
              type="text"
              value={item.item}
              onChange={(e) => {
                const newChecklists = [...(task.checklists || [])];
                newChecklists[index].items[itemIndex].item = e.target.value;
                onChange?.('checklists', newChecklists);

                if (
                  itemIndex === checklist.items.length - 1 &&
                  e.target.value
                ) {
                  newChecklists[index].items.push({
                    item: '',
                    isCompleted: false,
                  });
                  onChange?.('checklists', newChecklists);
                }
              }}
              placeholder="Enter item text..."
              className="border-0 border-b border-transparent hover:border-gray-200 focus:border-gray-300 focus:ring-0 p-0 pb-1 text-sm flex-1 bg-white"
            />
            {itemIndex !== checklist.items.length - 1 && (
              <button
                onClick={() => {
                  const newChecklists = [...(task.checklists || [])];
                  newChecklists[index].items.splice(itemIndex, 1);
                  onChange?.('checklists', newChecklists);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TaskFields({
  task,
  isEditing,
  onChange,
  validationErrors,
}: TaskFieldsProps) {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <Input
          label="Title *"
          value={task?.title}
          onChange={(e) => onChange?.('title', e.target.value)}
          required
          className={
            validationErrors?.title ? 'border-red-200 focus:border-red-300' : ''
          }
        />
        <MultiSelect
          label="Assignees"
          selectedUsers={task?.assignees || []}
          onChange={(users) => onChange?.('assignees', users)}
          options={mockUsers}
        />
        <Textarea
          label="Description"
          value={task?.description}
          onChange={(e) => onChange?.('description', e.target.value)}
          className="bg-white"
        />
        <DatePicker
          label="Due date"
          value={task?.dueDate}
          onChange={(date) => onChange?.('dueDate', date)}
        />

        {task?.checklists && task.checklists.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Checklists
            </label>
            <div className="space-y-3">
              {task.checklists.map(
                (checklist, index) =>
                  onChange && (
                    <ChecklistSection
                      key={index}
                      checklist={checklist}
                      index={index}
                      task={task}
                      onChange={onChange}
                      validationErrors={validationErrors}
                    />
                  )
              )}
            </div>
          </div>
        )}

        {task?.attachments && task.attachments.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Attachments
            </label>
            <div className="space-y-2">
              {task.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600 group"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="flex-1">{attachment.filename}</span>
                  <button
                    onClick={() => {
                      const newAttachments = [...(task.attachments || [])];
                      newAttachments.splice(index, 1);
                      onChange?.('attachments', newAttachments);
                    }}
                    className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl">{task?.title}</h3>
      {task?.description && (
        <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
      )}
      {task?.dueDate && (
        <div className="text-sm text-gray-500">
          Due date: {new Date(task.dueDate).toLocaleDateString('en-GB')}
        </div>
      )}
      {task?.assignees && task.assignees.length > 0 && (
        <div className="space-y-1">
          <span className="text-sm text-gray-500">Assignees:</span>
          <div className="flex flex-wrap gap-2">
            {task.assignees.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1 bg-gray-50 text-gray-700 rounded-full pr-2 max-w-[150px] overflow-hidden"
                title={user.name}
              >
                <Avatar name={user.name} size="sm" />
                <span className="text-xs truncate flex-1 pl-1">
                  {truncateName(user.name, 15)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {task?.checklists && task.checklists.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Checklists
          </label>
          {task.checklists.map((checklist, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-medium text-gray-600">
                  {checklist.name}
                </h4>
              </div>
              <div className="space-y-1 pl-6">
                {checklist.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className={`w-4 h-4 flex items-center justify-center rounded border border-gray-300 ${
                        item.isCompleted ? 'bg-white border-gray-300' : ''
                      }`}
                    >
                      {item.isCompleted && (
                        <svg
                          className="w-3 h-3 text-black"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.5 6L5 8.5L9.5 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={
                        item.isCompleted ? 'text-gray-500 line-through' : ''
                      }
                    >
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {task?.attachments && task.attachments.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Attachments
          </label>
          <div className="space-y-2 pl-6">
            {task.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <span>{attachment.filename}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
