import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { getToken } from '../../utils/auth';
import { ProfileSectionProps} from "../../../../types/profileSection";

const GroupSection = () => {
  const authContext = useContext(AuthContext);
  const token = getToken();
  const [userGroups, setUserGroups] = useState<{
    group: any; id: string; name: string; description: string 
}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<{ [groupId: string]: string[] }>({});

  useEffect(() => {
    async function fetchUserGroups() {
      if (token && authContext && authContext.user) {
        try {
          const response = await fetch(`/api/group?userId=${authContext.user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserGroups(data);

            // Nouvelle boucle pour récupérer les membres de chaque groupe
            const memberPromises = data.map(async (groupItem: { group: { id: any; }; }) => {
              const memberResponse = await fetch(`/api/groupMembers?groupId=${groupItem.group.id}`);
              return memberResponse.json();
            });

            const members = await Promise.all(memberPromises);
            const memberObj: { [groupId: string]: string[] } = {};
            members.forEach((memberList, index) => {
              console.log('memberList pour le groupe:', data[index].group.id, memberList);
              memberObj[data[index].group.id] = memberList.map((member: { user: { username: any; }; }) => member.user.username);

            });
            console.log('memberOBJ du GroupSection.tsx', memberObj)
            setGroupMembers(memberObj);
            setIsLoading(false);
          } else {
            setError('Erreur lors de la récupération des groupes.');
          }
        } catch (error) {
          setError('Erreur lors de la récupération des groupes.');
        }
      }
    }

    if (authContext && token) {
      fetchUserGroups();
    }
  }, [authContext, token]);

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div>
        <p>Chargement en cours...</p>
      </div>
    );
  }
  if (!authContext) {
    // Gérer le cas où le contexte n'est pas défini, par exemple, rediriger vers la page de connexion
    return (
      <div>
        <p>Authentification requise.</p>
      </div>
    );
  }
 
  console.log('userGroups dans le composant', userGroups);

  return (
    <div className="bg-gray-200 p-6 space-y-4">
      {userGroups.map((groupItem) => (
        <div key={groupItem.group.id} className="bg-white shadow-lg p-6 border rounded-lg space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`groupName-${groupItem.group.id}`}>
              Nom du groupe
            </label>
            <p className="text-xl text-gray-800 font-semibold" id={`groupName-${groupItem.group.id}`}>
              {groupItem.group.name}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`groupDescription-${groupItem.group.id}`}>
              Description du groupe
            </label>
            <p className="text-gray-700" id={`groupDescription-${groupItem.group.id}`}>
              {groupItem.group.description}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`groupMembers-${groupItem.group.id}`}>
              Membres du groupe
            </label>
            <ul className="list-disc list-inside space-y-2" id={`groupMembers-${groupItem.group.id}`}>
              {groupMembers[groupItem.group.id]?.map((member, index) => (
                <li key={index} className="text-gray-800">
                  {member}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}  

export default GroupSection;
