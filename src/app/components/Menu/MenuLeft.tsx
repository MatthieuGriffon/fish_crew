'use client'
import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext } from '../../../contexts/AuthContext';

const MenuLeft = () => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    console.log('user du MenuLeft', user);
    const userID = authContext && authContext.user ? authContext.user.id : 'Non connecté';
    console.log('userID du MenuLeft', userID);
    const pathname = usePathname();
  return (
    <nav className="ml-8 mt-4 bg-gray-800 bg-opacity-80 rounded-2xl text-white w-72 p-4 min-w-[18rem] max-h-[18rem]">
      <h2 className="text-3xl font-bold mb-4">Menu</h2>
      
      <ul className="space-y-4">
        <li>
          <Link
            className={`link block py-2 px-4 rounded-lg ${
              pathname === '/' ? 'bg-blue-500' : 'hover:bg-blue-500 hover:text-white'
            }`}
            href="/"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`link block py-2 px-4 rounded-lg ${
              pathname === 'groups' ? 'bg-blue-500' : 'hover:bg-blue-500 hover:text-white'
            }`}
            href="/groups"
          >
            Groupes de peche
          </Link>
        </li>
        <li>
          <Link
            className={`link block py-2 px-4 rounded-lg ${
              pathname === 'groups' ? 'bg-blue-500' : 'hover:bg-blue-500 hover:text-white'
            }`}
            href="/groups"
          >
            Carte
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MenuLeft;
