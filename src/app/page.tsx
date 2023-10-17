'use client';
import SignupForm from './components/Form/SignupForm';
import SigninForm from './components/Form/SigninForm';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import dotenv from 'dotenv';
dotenv.config();

const Home = () => {
  return (
    <main className="flex flex-col justify-center items-center space-y-8 md:space-x-8 bg-red-500">
      <div className="flex flex-row w-full">
        <div className="w-full flex-row">
          <h1 className="text-2xl font-bold">Inscription</h1>
          <SignupForm />
        </div>
        <div className="w-full">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <SigninForm />
        </div>
      </div>
      <AuthProvider>
        <div className="w-full">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <Dashboard />
        </div>
      </AuthProvider>
    </main>
  );
};

export default Home;
