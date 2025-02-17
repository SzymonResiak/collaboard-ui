'use client';

import * as React from 'react';
import { Avatar } from './avatar';
import { Search } from 'lucide-react';
import { UserDto } from '@/types/user';
interface MultiSelectProps {
  label?: string;
  selectedUsers: UserDto[];
  onChange: (users: UserDto[]) => void;
  options: UserDto[];
}

function truncateName(name: string, wordLimit: number = 3): string {
  const words = name.split(' ');
  if (words.length <= wordLimit) return name;
  return words.slice(0, wordLimit).join(' ') + '...';
}

export function MultiSelect({
  label,
  selectedUsers,
  onChange,
  options,
}: MultiSelectProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredOptions = options
    .filter((user) => !selectedUsers.find((u) => u.id === user.id))
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  // Obsługa kliknięcia poza komponentem
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Lista wybranych użytkowników */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedUsers.map((user) => (
          <div
            key={user.id}
            className="group flex items-center gap-1 bg-blue-50 text-blue-700 rounded-full pr-2 max-w-[150px] overflow-hidden"
            title={user.name}
          >
            <Avatar name={user.name} size="sm" />
            <span className="text-xs truncate flex-1 pl-1">
              {truncateName(user.name, 15)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(selectedUsers.filter((u) => u.id !== user.id));
              }}
              className="hover:text-blue-900 flex-shrink-0 px-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Wyszukiwarka i dropdown */}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className="w-full p-2 pr-8 border rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            placeholder="Wyszukaj użytkownika..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              setIsOpen(true);
            }}
            onBlur={(e) => {
              // Sprawdzamy czy kliknięcie było w dropdown
              if (!containerRef.current?.contains(e.relatedTarget)) {
                setTimeout(handleClose, 100);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleClose();
                inputRef.current?.blur();
              }
            }}
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {isOpen && filteredOptions.length > 0 && (
          <div
            className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto z-10"
            onMouseDown={(e) => e.preventDefault()} // Zapobiega problemom z blur
          >
            {filteredOptions.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer overflow-hidden"
                title={user.name}
                onClick={() => {
                  onChange([...selectedUsers, user]);
                  setSearchQuery('');
                  setIsOpen(false);
                  inputRef.current?.blur();
                }}
              >
                <Avatar name={user.name} size="sm" className="flex-shrink-0" />
                <span className="text-sm truncate flex-1">
                  {truncateName(user.name, 15)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
