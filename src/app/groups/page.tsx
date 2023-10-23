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

const GroupPage: React.FC = () => {
  const [userID, setUserID] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [refreshKeyJoinGroup, setRefreshKeyJoinGroup] = useState(0); 
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
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          setIsLoggedIn(false);
        }
      }

      if (isLoggedIn) {
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
      }
    };

    fetchGroups();
  }, [userID, isLoggedIn, refreshKeyJoinGroup]);

  const joinGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/joinGroup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userID, groupId }), // Assurez-vous que les données sont correctement envoyées
      });

      if (response.ok) {
        console.log('Utilisateur ajouté au groupe avec succès !');
        setRefreshKeyJoinGroup(prevKey => prevKey + 1);
      } else {
        console.error('Échec de la requête de rejoindre le groupe');
      }
    } catch (error) {
      console.error('Erreur lors de la requête de rejoindre le groupe :', error);
    }
  };
  return (
    <div className="container mx-auto h-screen flex flex-col items-center text-black opacity-4">
      {isLoggedIn ? (
        <div className="mt-8 w-4/4 ml-[16rem] opacity-4">
          <h2 className="text-3xl bg-gray-400  font-extrabold text-center text-white mb-6 p-5">Liste des groupes :</h2>
          <table className="table-auto w-full">
            <thead>
              <tr className='text-white bg-gray-600'>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={group.id} className={index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-800'}>
                  <td className="border px-4 py-2 text-white">{group.name}</td>
                  <td className="border px-4 py-2 text-white">{group.description}</td>
                  <td className="border px-4 py-2 text-center text-white">{group.isPublic ? 'Public' : 'Private'}</td>
                  <td className="border px-4 py-2 text-center text-white">
                    {group.isPublic ? (
                      group.isMember ? (
                        <span className="text-green-500">Membre du groupe</span>
                      ) : (
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => joinGroup(group.id)}
                        >
                          Rejoindre le groupe
                        </button>
                      )
                    ) : (
                      <span className="text-red-500">Groupe privé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-200 p-4 rounded-lg mt-8">
        <p className="text-xl font-semibold text-red-500">
        Utilisateur non connecté. Veuillez vous connecter pour voir les groupes.
        </p>
        </div>
      )}
    </div>
  );
};

export default GroupPage;
