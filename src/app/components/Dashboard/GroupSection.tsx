import React, { FC, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { getToken } from '../../utils/auth';
import { GroupMember } from '../../../../types/group';
import CreateGroupe from './CreateGroup/CreateGroupe';
import ConfirmModal from './ConfirmModal/ConfirmModal';

interface MessageWrapperProps {
  message: string;
}

const MessageWrapper: FC<MessageWrapperProps> = ({ message }) => (
  <div>
    <p>{message}</p>
  </div>
);

const GroupSection: FC = () => {
  const authContext = useContext(AuthContext);
  const token = getToken();

  const [userGroups, setUserGroups] = useState<{
    group: any;
    id: string;
    name: string;
    description: string;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<{ [groupId: string]: GroupMember[] }>({});
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  const handleGroupCreated = () => {
    setShowCreateGroup(false);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroupToDelete(groupId);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteGroup = async () => {
    console.log("Tentative de suppression du groupe", groupToDelete);

    if (!groupToDelete) {
      return;
    }

    try {
      const response = await fetch('/api/groups/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId: groupToDelete,
          userId: authContext?.user?.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Une erreur s’est produite lors de la suppression du groupe.');
      }

      console.log("Groupe supprimé avec succès");
      setRefreshKey(prevKey => prevKey + 1);

    } catch (error) {
      console.error("Erreur lors de la suppression du groupe:", error instanceof Error ? error.message : "Erreur inconnue");
    }

    setIsConfirmModalOpen(false);
    setGroupToDelete(null);
  };

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

  useEffect(() => {
    if (authContext && token) {
      fetchUserGroups();
    }
  }, [authContext, token, refreshKey]);

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
    <>
    <div className="bg-black bg-opacity-50 p-6 rounded-md shadow-md w-[70%] mx-auto space-y-4 max-h-[48vh] overflow-y-auto mt-8">
      {showCreateGroup ? (
        <CreateGroupe onGroupCreated={handleGroupCreated} />
      ) : (
        
        userGroups.map((groupItem) => (
          <div 
              key={groupItem.group.id} 
              className="bg-gray-900 bg-opacity-70 shadow-md p-6 border rounded-lg space-y-4 m-3 ${index === 0 ? 'mt-32' : 'mt-8'}`">
            <div
               className="flex justify-between items-center">
              <p className="text-xl text-white font-semibold" id={`groupName-${groupItem.group.id}`}>
                {groupItem.group.name}
              </p>
              {groupMembers[groupItem.group.id]?.length > 0 && authContext.user && authContext.user.id && groupMembers[groupItem.group.id][0].user.id === authContext.user.id && (
                <button onClick={() => handleDeleteGroup(groupItem.group.id)} className="text-red-600 border border-red-600 px-2 py-1 rounded-md">
                  Supprimer le groupe
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm text-white font-semibold mb-1" htmlFor={`groupDescription-${groupItem.group.id}`}>
                Description du groupe
              </label>
              <p className="text-white" id={`groupDescription-${groupItem.group.id}`}>
                {groupItem.group.description}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1" htmlFor={`groupMembers-${groupItem.group.id}`}>
                Membres du groupe
              </label>
              <ul className="list-disc list-inside space-y-2" id={`groupMembers-${groupItem.group.id}`}>
                {groupMembers[groupItem.group.id]?.sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()).map((member, index) => (
                  <li key={index} className="text-white">
                    {member.user.username}
                    {index === 0 && ' ⭐'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}


  {isConfirmModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-100 rounded-lg shadow-md p-6 w-[20%] mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Supprimer le groupe</h2>
        <p className="text-white">Etes vous sur de vouloir supprimer complétement le groupe?</p>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={confirmDeleteGroup}
          >
            Confirmer
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={() => setIsConfirmModalOpen(false)}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )}
    </div>
    <div className='flex w-80 bg-black bg-opacity-50 p-2 rounded-md shadow-md w-[70%] mx-auto space-y-4 max-h-[50vh] overflow-y-auto mt-4 justify-center items-center'>
    <button
        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setShowCreateGroup(prevState => !prevState)}>
        {showCreateGroup ? 'Afficher les groupes' : 'Creer un nouveau groupe'}
    </button>
</div>
    </>
  );
};

export default GroupSection;
