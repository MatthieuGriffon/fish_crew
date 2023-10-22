'use client'

import React, { useEffect, useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  email: string;
  userId: string;
}

interface GroupMember {
  groupId: string;
  userId: string;
  roleId: string;
  joinedAt: string;
  user: {
    username: string;
  };
}

interface Group {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  isMember: boolean;
  groupMembers: GroupMember[];
}

const TokenPage: React.FC = () => {
  const [userID, setUserID] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    let token = '';

    const fetchGroups = async () => {
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token') || '';

        try {
          const decodedToken = jwt.decode(token) as DecodedToken;

          if (decodedToken) {
            setUserID(decodedToken.userId);
          } else {
            console.error('Failed to decode token');
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }

      try {
        const response = await fetch('/api/groupList');
        if (response.ok) {
          const data = await response.json();
          const updatedGroups = data.groups.map((group: Group) => ({
            ...group,
            isMember: group.groupMembers.some((member) => member.userId === userID),
          }));
          console.log('Updated Groups:', updatedGroups);

          setGroups(updatedGroups);
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [userID]);

  return (
    <div className="container mx-auto h-screen flex flex-col items-center text-black">
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center uppercase mb-4">Utilisateur connecté :</h2>
        <p className="text-xl font-semibold">{userID}</p>
        <h2 className="text-2xl font-bold text-center uppercase mb-4">Liste des groupes:</h2>
        <table className="table-auto mt-4 w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Public</th>
              <th className="px-4 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, index) => (
              <tr key={group.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                <td className="border px-4 py-2">{group.name}</td>
                <td className="border px-4 py-2">{group.description}</td>
                <td className="border px-4 py-2">{group.isPublic ? 'Public' : 'Private'}</td>
                <td className="border px-4 py-2">
                  {group.isPublic ? (
                    group.isMember ? (
                      'Membre du groupe'
                    ) : (
                      <button>Rejoindre le groupe</button>
                    )
                  ) : (
                    'Groupe privé'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenPage;

