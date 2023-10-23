'use client';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import dotenv from 'dotenv';
dotenv.config();

const Home = () => {
  return (
    <AuthProvider>
    <main className="flex flex-row flex-nowrap justify-center h-screen w-screen">
      <section className="w-3/4 p-4 space-y-8">
   
          <div>
            <Dashboard />
          </div>
       
      </section>
    </main>
    </AuthProvider>
  );
};

export default Home;