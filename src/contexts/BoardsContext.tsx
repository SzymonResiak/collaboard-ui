'use client';

import { createContext, useContext, useState } from 'react';
import { Board } from '@/types/board';

interface BoardsContextType {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
}

const BoardsContext = createContext<BoardsContextType>({
  boards: [],
  setBoards: () => {},
});

export function BoardsProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);

  return (
    <BoardsContext.Provider value={{ boards, setBoards }}>
      {children}
    </BoardsContext.Provider>
  );
}

export function useBoards() {
  return useContext(BoardsContext);
}
