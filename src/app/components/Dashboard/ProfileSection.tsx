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
    <div className="bg-white bg-opacity-20 p-4 rounded-md shadow-md mt-10 w-[80%] mx-auto">
      <div className="text-center mb-4">
        <p className='text-3xl font-bold uppercase text-center bg-black flex items-center justify-center bg-opacity-50 p-4 shadow-md rounded-md'>
        Mon Profil
      </p>
     </div>
  
      <div className="bg-gray-100 bg-opacity-10 p-4 rounded-md shadow-inner mb-4">
        {userData ? (
          <>
            <p className="mb-2"><span className="font-bold">Nom d'utilisateur :</span> {userData.username || 'N/A'}</p>
            <p className="mb-2"><span className="font-bold">Adresse e-mail :</span> {userData.email || 'N/A'}</p>
            <p className="mb-2"><span className="font-bold">Ville :</span> {userData.city || 'N/A'}</p>
            <p className="mb-2"><span className="font-bold">Département :</span> {userData.department || 'N/A'}</p>
            <p className="mb-2"><span className="font-bold">Rôle :</span> {userData.role?.name || 'N/A'}</p>
          </>
        ) : (
          <p className="text-center">Chargement des données...</p>
        )}
      </div>
  
      <button 
        onClick={toggleEditing} 
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
      >
        {isEditing ? 'Fermer l\'édition' : 'Modifier les informations'}
      </button>
    </div>
  );
}  
 

export default ProfileSection;
