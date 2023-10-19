'use client';
import SignupForm from './components/Form/SignupForm';
import SigninForm from './components/Form/SigninForm';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import Link from 'next/link';
import dotenv from 'dotenv';
import { usePathname } from 'next/navigation';
dotenv.config();
import Image from 'next/image';


export function Links() {
  const pathname = usePathname();

  return (
    <nav>
      <ul>
        <li>
          <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
            Home
          </Link>
        </li>
        <li>
          <Link className={`link ${pathname === 'groups' ? 'active' : ''}`} href="/groups">
            Groupes de peche
          </Link>
        </li>
        <li>
          <Link className={`link ${pathname === 'groups' ? 'active' : ''}`} href="/groups">
            Carte
          </Link>
        </li>
        {/* ... autres liens */}
      </ul>
    </nav>
  );
}

const Home = () => {
  return (
    <main className="flex flex-row justify-between h-[100vh] w-[100vw] relative">


    {/* Menu à gauche */}
    <aside className=" w-1/4 p-4 space-y-4 z-10">
        <h1 className="text-2xl font-bold text-white">Menu</h1>
        <Links />
      </aside>

      {/* Contenu à droite */}
      <section className="flex flex-col w-3/4 p-4 space-y-8 z-10">
        <div className="flex space-x-8">
        
        </div>

        <AuthProvider>
          <div>
            <Dashboard />
          </div>
        </AuthProvider>
      </section>

    </main>
  );
};


export default Home;