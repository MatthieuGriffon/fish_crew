import React, { FC, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { getToken } from '../../utils/auth';
import { GroupMember } from '../../../../types/group';
import CreateGroupe from './CreateGroup/CreateGroupe';
import ConfirmModal from './ConfirmModal/ConfirmModal';
import EditGroup from './EditGroup/EditGroup';
import AddMemberModal from './AddMemberModal/AddMemberModal';
import ConfirmDeleteModal from './ConfirmDeleteModal/ConfirmDeleteModal';
import RemoveMemberModal from './RemoveMemberModal/RemoveMemberModal';

 {/* Component pour afficher les messages */}
interface MessageWrapperProps {
  message: string;
}

const MessageWrapper: FC<MessageWrapperProps> = ({ message }) => (
  <div>
    <p>{message}</p>
  </div>
);
 {/* Composant principal pour la section Groupes*/}
const GroupSection: FC = () => {
    {/* Contexte et token d'authentification */}
  const authContext = useContext(AuthContext);
  const token = getToken();
    {/* Etats du composant */}
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<any | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [groupToAddMember, setGroupToAddMember] = useState<any | null>(null);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ member: GroupMember, groupId: string } | null>(null);


  const handleAddMember = (group: any) => {
    setGroupToAddMember(group);
    setIsAddMemberModalOpen(true);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const submitAddMember = async (email: string) => {
    if (!groupToAddMember) {
        console.error('Erreur : le groupe n’est pas sélectionné.');
        return;
    }

    try {
        const response = await fetch('/api/groups/add-member', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ groupId: groupToAddMember.id, email }),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error(data.error);
            // Vous pouvez ajouter une notification ou une alerte ici pour informer l'utilisateur
            return;
        }
        setIsAddMemberModalOpen(false);
        setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
        console.error('Erreur lors de l’ajout du membre:', error);
       
    }
  };


  const handleGroupCreated = () => {
    setShowCreateGroup(false);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleEditGroup = (group: any) => {
    setGroupToEdit(group);
    setIsEditModalOpen(true);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroupToDelete(groupId);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteGroup = async () => {
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
      setRefreshKey(prevKey => prevKey + 1);

    } catch (error) {
      console.error("Erreur lors de la suppression du groupe:", error instanceof Error ? error.message : "Erreur inconnue");
    }

    setIsConfirmModalOpen(false);
    setGroupToDelete(null);
  };

  const removeGroupMember = async () => {
    if (!memberToRemove || !memberToRemove.groupId) {
        console.error('Erreur : Membre ou groupe non sélectionné.');
        return;
    }

    try {
        const response = await fetch('/api/groups/remove-member', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              groupId: memberToRemove.groupId, 
              userId: memberToRemove.member.user.id 
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error(data.error);
            // Vous pouvez ajouter une notification ou une alerte ici pour informer l'utilisateur
            return;
        }
        setIsRemoveMemberModalOpen(false);
        setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
        console.error('Erreur lors de la suppression du membre:', error);
    }
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
  // { Rendu du composant principal }
  return (
    <>
    <div className="bg-black bg-opacity-50 p-6 rounded-md shadow-md w-[70%] mx-auto space-y-4 max-h-[48vh] overflow-y-auto mt-8">
      {showCreateGroup ? (
        <CreateGroupe onGroupCreated={handleGroupCreated} />
      ) : (
        
        userGroups.map((groupItem) => (
          <div key={groupItem.group.id} className="bg-gray-900 bg-opacity-70 shadow-md p-6 border rounded-lg space-y-4 m-3">
            <div className="flex justify-between items-center">
              <p className="text-xl text-white font-semibold" id={`groupName-${groupItem.group.id}`}>
                {groupItem.group.name}
              </p>
              {groupMembers[groupItem.group.id]?.length > 0 && authContext.user && authContext.user.id && groupMembers[groupItem.group.id][0].user.id === authContext.user.id && (
                <div className="flex flex-col space-y-2">
                  <button onClick={() => handleEditGroup(groupItem.group)} className="text-blue-600 border border-blue-600 px-2 py-1 rounded-md">
                    Éditer le groupe
                  </button>
                  <button onClick={() => handleDeleteGroup(groupItem.group.id)} className="text-red-600 border border-red-600 px-2 py-1 rounded-md">
                    Supprimer le groupe
                  </button>
                  <button onClick={() => handleAddMember(groupItem.group)} className="text-green-600 border border-green-600 px-2 py-1 rounded-md">
                  Ajouter un membre
                  </button>
                </div>
              )}
            </div>
            {isEditModalOpen && groupToEdit && groupToEdit.id === groupItem.group.id && (
              <EditGroup group={groupToEdit} onGroupUpdated={() => {
                setGroupToEdit(null);
                setIsEditModalOpen(false);
                setRefreshKey(prevKey => prevKey + 1);
              }} />
            )}
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
              <li key={index} className="text-white flex justify-between items-center">
             <span>
            {member.user.username}
            {index === 0 && ' ⭐'}
            </span>
            {index !== 0 && (
            <button onClick={() => {
              setMemberToRemove({ member: member, groupId: groupItem.group.id });
                setIsRemoveMemberModalOpen(true);
            }} className="text-red-600 border border-red-600 px-2 py-1 rounded-md">
                Supprimer
            </button>
        )}
    </li>
))}

              </ul>
            </div>
          </div>
        ))
      )}
  <ConfirmDeleteModal 
              isOpen={isConfirmModalOpen}
              onConfirm={confirmDeleteGroup}
              onCancel={() => setIsConfirmModalOpen(false)}
          />

  <AddMemberModal
    isOpen={isAddMemberModalOpen}
    onAdd={(email) => submitAddMember(email)}
    onCancel={() => setIsAddMemberModalOpen(false)}
          />
  <RemoveMemberModal
    isOpen={isRemoveMemberModalOpen}
    memberName={memberToRemove?.member.user.username}
    onRemove={removeGroupMember}
    onCancel={() => setIsRemoveMemberModalOpen(false)}
/>

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
