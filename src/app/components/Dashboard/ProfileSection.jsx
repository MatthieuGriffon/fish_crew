import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';  

const ProfileSection = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
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
      <p className='text-3xl p-2 bg-red-800 rounded-sm w-1/3 mt-3'>ProfileSection</p>
      
      <div>
        {userData ? (
          <>
            <p>Nom d'utilisateur : {userData.username}</p>
            <p>Adresse e-mail : {userData.email}</p>
            <p>Ville : {userData.city}</p>
            <p>Département : {userData.department}</p>
            <p>Rôle : {userData.role.name}</p>
          </>
        ) : (
          <p>Chargement des données...</p>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
