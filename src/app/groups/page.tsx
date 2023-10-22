'use client'
import React, { useEffect, useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  email: string;
  userId: string;
  // Ajoutez d'autres propriétés si elles sont présentes dans votre token
}

const TokenPage: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [userID, setUserID] = useState<string>('');

  useEffect(() => {
    let token = '';

    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';

      try {
        const decodedToken = jwt.decode(token) as DecodedToken;

        if (decodedToken) {
          setUserName(decodedToken.email);
          setUserID(decodedToken.userId);
        } else {
          console.error('Failed to decode token');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  return (
    <div className="container mx-auto h-screen flex justify-center items-center">
      <h1 className="text-3xl font-bold">Utilisateur: {userName}</h1>
      <h1 className="text-3xl font-bold">Id utilisateur: {userID}</h1>
    </div>
  );
};

export default TokenPage;

