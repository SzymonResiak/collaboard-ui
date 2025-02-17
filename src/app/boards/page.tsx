'use client';

import { PageContainer } from '@/components/ui/page-container';
import { mockBoards } from '@/mocks/groups';
import { BoardCard } from '@/components/cards/board-card';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Board } from '@/types/board';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BOARDS_PER_PAGE = 12;

function BoardSkeleton() {
  return (
    <div className="h-[16rem] w-[30rem] rounded-cb-lg p-4 bg-gray-100 animate-pulse flex flex-col">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mt-4" />
      <div className="mt-auto space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-8 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>(mockBoards);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const sortedBoards = useMemo(() => {
    return [...boards].sort((a, b) => {
      if (a.favourite !== b.favourite) {
        return a.favourite ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [boards]);

  const totalPages = Math.ceil(sortedBoards.length / BOARDS_PER_PAGE);
  const paginatedBoards = sortedBoards.slice(
    (currentPage - 1) * BOARDS_PER_PAGE,
    currentPage * BOARDS_PER_PAGE
  );

  const toggleFavourite = (boardId: string) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId ? { ...board, favourite: !board.favourite } : board
      )
    );
  };

  const changePage = (newPage: number) => {
    setIsLoading(true);
    setCurrentPage(newPage);
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  return (
    <PageContainer title="My Boards">
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 relative">
          <div className="absolute inset-0">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={currentPage}
                className="grid grid-cols-4 gap-10 h-[52rem] px-20 content-start"
              >
                {isLoading
                  ? Array.from({ length: paginatedBoards.length }).map(
                      (_, i) => <BoardSkeleton key={i} />
                    )
                  : paginatedBoards.map((board) => (
                      <motion.div
                        key={board.id}
                        layout
                        layoutId={board.id}
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          layout: {
                            duration: 0.3,
                            type: 'spring',
                            bounce: 0.15,
                          },
                        }}
                      >
                        <BoardCard
                          board={board}
                          onFavoriteToggle={() => toggleFavourite(board.id)}
                        />
                      </motion.div>
                    ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="sticky bottom-0 w-full">
            <div className="flex justify-center items-center gap-4 py-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => changePage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  changePage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
