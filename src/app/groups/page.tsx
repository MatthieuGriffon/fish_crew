'use client'

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import { getToken, getUserFromToken } from '../../../src/app/utils/auth'; // Import getUserFromToken






interface Group {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  console.log('Groupe du GroupList', groups)

  // Récupération du token et affichage dans la console
  const token = getToken();
  console.log('Token de GroupList:', token);

  // Récupération de l'utilisateur à partir du token
  const user = getUserFromToken();
  console.log('User from token du GroupList:', user);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groupList'); 
        const data = await response.json();
        const { groups } = data; // Extract the 'groups' array from the data object
        setGroups(groups); // Set the extracted 'groups' array to the state
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    

    fetchGroups();
  }, []);

  return (
    <div className="container mx-auto h-[100vh]">
      <h1 className="text-2xl font-bold mb-4">Liste des groupes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups && groups.map((group) => (
          <div key={group.id} className="border border-gray-300 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">{group.name}</h2>
            <p className="text-gray-500">{group.description}</p>
            <p className="text-gray-500">{group.isPublic ? 'Public' : 'Private'}</p>
            <p className="text-gray-500">{`Created at: ${new Date(group.createdAt).toLocaleString()}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const GroupPage: React.FC = () => {
  return (
    <AuthProvider>
      <Groups />
    </AuthProvider>
  );
};

export default GroupPage;
