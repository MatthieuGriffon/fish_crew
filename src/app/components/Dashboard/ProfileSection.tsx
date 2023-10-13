import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { ProfileSectionPropsWithoutRole } from '../../../contexts/AuthContext';
import { ProfileSectionProps } from '../../../../types/profileSection';

const ProfileSection: React.FC<ProfileSectionProps | ProfileSectionPropsWithoutRole> = ({ toggleEditing, user, isEditing }) => {
  const [userData, setUserData] = useState<{
    username: string | null;
    email: string | null;
    city: string | null;
    department: string | null;
    role: {
      name: string | null;
    } | null;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.username != null) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          } else {
            console.error('La requête a échoué.');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div>
      

    <div>
      <p className='text-3xl p-2 bg-red-800 rounded-sm w-1/3 mt-3'>ProfileSection</p>

      <div>
        {userData ? (
          <>
            <p>Nom d'utilisateur : {userData.username || 'N/A'}</p>
            <p>Adresse e-mail : {userData.email || 'N/A'}</p>
            <p>Ville : {userData.city || 'N/A'}</p>
            <p>Département : {userData.department || 'N/A'}</p>
            <p>Rôle : {userData.role?.name || 'N/A'}</p>
          </>
        ) : (
          <p>Chargement des données...</p>
        )}
      </div>
    </div>
    <button onClick={toggleEditing} className="mt-2 p-2 bg-blue-500 text-white rounded-md">
        
  {isEditing ? 'Fermer l\'édition' : 'Modifier les informations'}
</button>
    </div>
    
  );
};

export default ProfileSection;
