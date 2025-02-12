'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav>
      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Button variant="ghost" asChild>
              <Link href="/user">Profile</Link>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/boards">My Boards</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/groups">Groups</Link>
            </Button>
            <Button variant="default">Create Task</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
