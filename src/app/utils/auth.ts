import jwt from 'jsonwebtoken';
import { AuthContext } from '../../contexts/AuthContext';
export const getToken = (): string | null => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return token;
};

export const getUserFromToken = (): { userId: string; email: string } | null => {
  const token = getToken();
  if (token) {
    try {
      // Remplacez 'YOUR_SECRET_KEY' par la clé secrète de votre choix
      const decodedToken = jwt.verify(token, 'tomjedusor') as { userId: string; email: string };
      return decodedToken;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  return null;
};

