'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TaskDialog } from '@/components/dialogs/TaskDialog';
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const Navbar = () => {
  const { user, fetchUser, isLoading } = useCurrentUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) return null; // lub jakiś loading spinner

  return (
    <nav>
      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="p-0 h-auto hover:bg-transparent"
              asChild
            >
              <Link href="/user">
                <Avatar name={user?.name} size="lg" />
              </Link>
            </Button>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{user?.name}</span>
              <div className="flex items-center gap-1 text-gray-500">
                <CopyToClipboard value={user?.memberCode}>
                  <span className="text-xs">#{user?.memberCode}</span>
                </CopyToClipboard>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/boards">My Boards</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/groups">Groups</Link>
            </Button>
            <Button
              variant="default"
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </Button>
          </div>

          <TaskDialog
            mode="create"
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={() => {
              setIsDialogOpen(false);
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
