'use client';

import { PageContainer } from '@/components/ui/page-container';
import { BoardCard } from '@/components/cards/board-card';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Board } from '@/types/board';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';

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
  const router = useRouter();
  const { user } = useCurrentUser();
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserAndBoards = async () => {
      try {
        const boardsResponse = await fetch('/api/boards');
        const boardsData = await boardsResponse.json();

        if (boardsData.error) {
          console.error('Error fetching boards:', boardsData.error);
          return;
        }

        setBoards(boardsData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserAndBoards();
  }, []);

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

  const handleFavouriteChange = (
    boardId: string,
    newFavouriteValue: boolean
  ) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? { ...board, favourite: newFavouriteValue }
          : board
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
                          id={board.id}
                          name={board.name}
                          description={board.description}
                          color={board.color}
                          columns={board.columns || []}
                          tasks={board.tasks || []}
                          admins={board.admins}
                          currentUserId={user?.id || ''}
                          favourite={board.favourite}
                          onFavouriteChange={(newValue: boolean) =>
                            handleFavouriteChange(board.id, newValue)
                          }
                          onClick={() => router.push(`/boards/id/${board.id}`)}
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
