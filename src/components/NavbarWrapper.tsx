'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

const NavbarWrapper = () => {
  const pathname = usePathname();
  const showNavbar = !['/login', '/register'].includes(pathname);

  if (!showNavbar) return null;
  return <Navbar />;
};

export default NavbarWrapper;
