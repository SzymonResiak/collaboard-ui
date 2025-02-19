'use client';

import { Board, Column } from '@/types/board';
import { Heart, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Task } from '@/types/task';

interface BoardCardProps {
  id: string;
  name: string;
  description: string;
  color: string;
  columns: Column[];
  tasks: Task[];
  admins: string[];
  currentUserId: string;
  favourite: boolean;
  onFavouriteChange: (newValue: boolean) => void;
  onClick: () => void;
}

export function BoardCard({
  id,
  name,
  description,
  color,
  columns,
  tasks,
  favourite,
  onFavouriteChange,
  onClick,
}: BoardCardProps) {
  const router = useRouter();

  const getTaskCountByColumn = (columnName: string) => {
    return tasks.filter((task) => task.status === columnName).length;
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      e.stopPropagation();
      return;
    }
    router.push(`/boards/${encodeURIComponent(name)}`);
  };

  const handleFavouriteClick = async (
    e: React.MouseEvent,
    newValue: boolean
  ) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/boards/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          favourite: newValue,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(
          `Failed to update board: ${response.status} ${response.statusText}`
        );
      }

      onFavouriteChange(newValue);
    } catch (error) {
      console.error('Error updating board favourite status:', error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-cb-lg p-4 shadow-sm hover:shadow-md transition-shadow h-[16rem] w-[30rem] flex flex-col cursor-pointer"
      style={{
        backgroundColor: color,
      }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-2xl line-clamp-2">{name}</h3>
        </div>
        <div className="flex items-start gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => handleFavouriteClick(e, !favourite)}
          >
            <Heart
              className={`h-5 w-5 ${
                favourite ? 'fill-black text-black' : 'text-black'
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-black" />
          </Button>
        </div>
      </div>

      <p className="text-gray-600 mt-4 truncate">{description}</p>

      <div className="mt-auto">
        {columns.map((column) => {
          const count = getTaskCountByColumn(column.name);
          const textColor = count > 0 ? 'text-black' : 'text-gray-600';

          return (
            <div key={column.name} className="flex text-sm">
              <span className={textColor}>{column.name}</span>
              <span className={textColor + ' ml-1'}>({count})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
