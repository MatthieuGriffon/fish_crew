import React, { FC, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { getToken } from '../../utils/auth';
import { GroupMember } from '../../../../types/group';

interface MessageWrapperProps {
  message: string;
}

const MessageWrapper: FC<MessageWrapperProps> = ({ message }) => (
  <div>
    <p>{message}</p>
  </div>
);

const GroupSection = () => {
  const authContext = useContext(AuthContext);
  const token = getToken();  
  const [userGroups, setUserGroups] = useState<{
    group: any; id: string; name: string; description: string 
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<{ [groupId: string]: GroupMember[] }>({});
  
  useEffect(() => {
    async function fetchUserGroups() {
      if (token && authContext?.user) {
        try {
          const response = await fetch(`/api/group?userId=${authContext.user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const { userGroups, allGroupMembers } = await response.json();            
            setUserGroups(userGroups);
            setGroupMembers(allGroupMembers);
            console.log ('allGroupMembers', allGroupMembers)
            setIsLoading(false);
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Erreur lors de la récupération des groupes.');
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
      return <MessageWrapper message={error} />;
    }
    if (isLoading) {
      return <MessageWrapper message="Chargement en cours..." />;
    }
    if (!authContext) {
      return <MessageWrapper message="Authentification requise." />;
    }
    
  return (
    <div className="bg-gray-200 p-6 space-y-4">
      {userGroups.map((groupItem) => (
        <div key={groupItem.group.id} className="bg-white shadow-lg p-6 border rounded-lg space-y-4">
          <div>
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
              {groupMembers[groupItem.group.id]?.sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()).map((member, index) => (
                <li key={index} className="text-gray-800">
                  {member.user.username}
                  {index === 0 && ' ⭐'} 
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
    );
  };  
export default GroupSection;