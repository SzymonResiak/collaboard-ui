'use client';

import { PageContainer } from '@/components/ui/page-container';
import { GroupCard } from '@/components/cards/group-card';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Group } from '@/types/group';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const GROUPS_PER_PAGE = 12;

function GroupSkeleton() {
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
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        const data = await response.json();

        if (data.error) {
          console.error('Error fetching groups:', data.error);
          return;
        }

        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      if (a.favourite !== b.favourite) {
        return a.favourite ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [groups]);

  const totalPages = Math.ceil(sortedGroups.length / GROUPS_PER_PAGE);
  const paginatedGroups = sortedGroups.slice(
    (currentPage - 1) * GROUPS_PER_PAGE,
    currentPage * GROUPS_PER_PAGE
  );

  const toggleFavourite = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, favourite: !group.favourite } : group
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
    <PageContainer title="My Groups">
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 relative">
          <div className="absolute inset-0">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={currentPage}
                className="grid grid-cols-4 gap-10 h-[52rem] px-20 content-start"
              >
                {isLoading
                  ? Array.from({ length: paginatedGroups.length }).map(
                      (_, i) => <GroupSkeleton key={i} />
                    )
                  : paginatedGroups.map((group) => (
                      <motion.div
                        key={group.id}
                        layout
                        layoutId={group.id}
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
                        <GroupCard
                          group={group}
                          onFavoriteToggle={() => toggleFavourite(group.id)}
                          onClick={() =>
                            router.push(
                              `/groups/${encodeURIComponent(group.name)}`
                            )
                          }
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
