'use client'

import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext } from '../../../contexts/AuthContext';
import { AuthProvider } from '../../../contexts/AuthContext';

const MenuLeft = () => {
    const pathname = usePathname();
    const authContext = useContext(AuthContext);
    const username = authContext && authContext.user ? authContext.user.username : 'Non connecté';
    const handleLogout = () => {
      localStorage.removeItem('token');
  
      if (authContext) {
        authContext.setUser(null);
      }
  
      fetch('/api/logout', {
        method: 'POST',
      })
        .then(() => {
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('Failed to log out:', error);
        });
    };

    return (
        <div>
            <nav className="ml-8 mt-4 bg-gray-800 bg-opacity-80 rounded-2xl text-white w-72 p-4 min-w-[19rem] max-h-[23rem]">
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
                                pathname === 'map' ? 'bg-blue-500' : 'hover:bg-blue-500 hover:text-white'
                            }`}
                            href="/map"
                        >
                            Carte
                        </Link>
                    </li>
                </ul>
                <p className="text-lg mb-4 text-center font-bold bg-neutral-900">
                    Connecté en tant que : {username}
                </p>
                <p className='text-lg mb-4 text-center font-bold bg-neutral-900'>
                <button
                onClick={handleLogout}
                className=" text-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                Déconnexion
                </button>
                </p>
            </nav>
        </div>
    );
};

const MenuLeftLayout = () => {
    const authContext = useContext(AuthContext);
    return (
        <AuthProvider>
            <MenuLeft />
        </AuthProvider>
    );
};

export default MenuLeftLayout;
