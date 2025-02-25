'use client';

import { useCallback, useEffect, useState } from 'react';
import { Board } from '@/types/board';

interface Member {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  members: Member[];
}

// Cache dla danych
let boardsCache: Board[] = [];
let isLoading = false;

export function useBoardsData() {
  const [boards, setBoards] = useState<Board[]>(boardsCache);
  const [loading, setLoading] = useState(isLoading);

  const fetchBoards = async () => {
    if (isLoading) return;

    try {
      isLoading = true;
      setLoading(true);

      const response = await fetch('/api/boards');
      const data = await response.json();

      boardsCache = data;
      setBoards(data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      isLoading = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardsCache.length === 0) {
      fetchBoards();
    }
  }, []);

  const getAvailableBoards = useCallback(
    (mode: 'OWN' | 'GROUP', groupId?: string) => {
      if (mode === 'OWN') {
        return boards.filter((board) => !board.group);
      }
      if (groupId) {
        return boards.filter((board) => board.group?.id === groupId);
      }
      return [];
    },
    [boards]
  );

  const getBoardMembers = useCallback(
    (boardId: string) => {
      const board = boards.find((b) => b.id === boardId);
      if (board?.group) {
        const groupBoards = boards.filter(
          (b) => b.group?.id === board.group?.id
        );
        const allMembers = new Set<string>();
        const members: Member[] = [];

        groupBoards.forEach((b) => {
          b.members?.forEach((member) => {
            if (!allMembers.has(member.id)) {
              allMembers.add(member.id);
              members.push(member);
            }
          });
        });

        return members;
      }
      return board?.members || [];
    },
    [boards]
  );

  const getGroups = useCallback(() => {
    const groupMap = new Map<string, Group>();

    boards.forEach((board) => {
      if (board.group) {
        const groupId = board.group.id;
        if (!groupMap.has(groupId)) {
          const groupBoards = boards.filter((b) => b.group?.id === groupId);
          const membersSet = new Set<string>();
          const members: Member[] = [];

          groupBoards.forEach((b) => {
            b.members?.forEach((member) => {
              if (!membersSet.has(member.id)) {
                membersSet.add(member.id);
                members.push(member);
              }
            });
          });

          groupMap.set(groupId, {
            id: groupId,
            name: board.group.name,
            members: members,
          });
        }
      }
    });

    return Array.from(groupMap.values());
  }, [boards]);

  return {
    boards,
    loading,
    getAvailableBoards,
    getBoardMembers,
    getGroups,
    refresh: fetchBoards,
  };
}
