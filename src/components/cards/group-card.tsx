'use client';

import { Group } from '@/types/group';
import { Heart, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface GroupCardProps {
  group: Group;
  onFavoriteToggle: () => void;
}

export function GroupCard({ group, onFavoriteToggle }: GroupCardProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      e.stopPropagation();
      return;
    }
    router.push(`/groups/${group.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-cb-lg p-4 shadow-sm hover:shadow-md transition-shadow h-[16rem] w-[30rem] flex flex-col cursor-pointer bg-white"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-2xl line-clamp-2">{group.name}</h3>
        </div>
        <div className="flex items-start gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
          >
            <Heart
              className={`h-5 w-5 ${
                group.favourite ? 'fill-black text-black' : 'text-black'
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

      <p className="text-gray-600 mt-4 truncate">{group.description}</p>

      <div className="mt-auto text-sm text-gray-600">
        <div>Members: {group.members.length}</div>
        <div>Admins: {group.admins.length}</div>
      </div>
    </div>
  );
}
