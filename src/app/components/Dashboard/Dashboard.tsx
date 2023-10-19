import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import ProfileSection from './ProfileSection';
import SettingsSection from './SettingsSection';
import GroupSection from './GroupSection';
import EditProfileForm from './EditProfileForm';
import { ProfileSectionProps, User } from "../../../../types/dashboard";

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveEdit = async (updatedUserData: {
    username: string;
    city: string;
    department: string;
    email: string;
  }) => {
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (authContext && authContext.updateUser && authContext.user) {
        const updatedUser = {
          ...authContext.user,
          city: updatedUserData.city || authContext.user.city,
          department: updatedUserData.department || authContext.user.department,
          email: updatedUserData.email || authContext.user.email,
          username:
            updatedUserData.username !== undefined
              ? updatedUserData.username
              : authContext.user.username,
        };
        authContext.updateUser(updatedUser);
      }

      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error('La sauvegarde a échoué.');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');

    if (authContext) {
      authContext.setUser(null);
    }

    fetch('/api/logout', {
      method: 'POST',
    })
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Failed to log out:', error);
      });
  };

  if (!authContext) {
    throw new Error(
      'AuthContext is undefined, make sure you are rendering Dashboard inside AuthProvider'
    );
  }

  const { user } = authContext;

  if (!user) {
    return (
      <div className="bg-black-200 p-4 rounded-md ">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="text-600">Veuillez vous connecter</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 bg-opacity-70 p-4 rounded-md shadow-md mt-2 w-[60%] max-h-[80vh] overflow-y:hidden">
    <div className='bg-black flex items-center justify-between bg-opacity-20 p-4 shadow-md rounded-md'>
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Déconnexion
      </button>
    </div>
      <div className="mt-4">
      <p className="text-lg font-semibold">Bienvenue, {user.username}. Depuis le tableau de bord, vous pouvez modifier votre profil, gérer les groupes auxquels vous appartenez et en créer de nouveaux.</p>

        <div className="mt-4">
          <ul className="flex space-x-4 position-fixed">
            <li>
              <a
                href="#"
                onClick={() => setActiveTab('profile')}
                className={`px-8 py-2  rounded-t-lg ${
                  activeTab === 'profile'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-blue-200 hover:text-blue-600'
                }`}
              >
                Profil
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setActiveTab('group')}
                className={`px-8 py-2 rounded-t-lg ${
                  activeTab === 'group'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-blue-200 hover:text-blue-600'
                }`}
              >
                Mes groupes
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setActiveTab('settings')}
                className={`px-8 py-2 rounded-t-lg ${
                  activeTab === 'settings'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-blue-200 hover:text-blue-600'
                }`}
              >
                Paramètres
              </a>
            </li>
           
          </ul>
          
          {activeTab === 'profile' && user && user.username && (
            isEditing ? (
              <EditProfileForm
                user={user}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                setIsEditing={setIsEditing}
              />
            ) : (
              <ProfileSection toggleEditing={toggleEditing}
                user={user}
                isEditing={isEditing}  />
            )
          )}
          {activeTab === 'group' && <GroupSection />}
          {activeTab === 'settings' && <SettingsSection />}
         
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
