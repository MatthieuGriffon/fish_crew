'use client'
import Link from 'next/link';
import SigninForm from '../Form/SigninForm';
import SignupForm from '../Form/SignupForm';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-center items-center w-full">
      <ul className="flex justify-around space-x-12">
        <li><SigninForm /></li>
        <li><SignupForm /></li>
      </ul>
    </nav>
  );
}

export default Navbar;