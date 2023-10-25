import React, { useContext, useState, useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthContext } from '@/contexts/AuthContext';
import { User, Group } from '../../../../types/user';

interface MarkerType {
  lat: number;
  lng: number;
}

interface MapWithMarkerPopupProps {
  markers: MarkerType[];
}

const MapWithMarkerPopup: React.FC<MapWithMarkerPopupProps> = ({ markers }) => {
  const authContext = useContext(AuthContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const map = useMap();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  if (authContext && authContext.user) {
    const { id, username, email, city, department, roleId, role, groupMembers, catches,chats } = authContext.user;
  }
  const handlePopupOpen = () => {
    setPopupOpen(true);
    console.log('popupOpen:', popupOpen); // Ajout d'un console.log pour vérifier la valeur de popupOpen
    fetchUserGroups(); // Appel de la fonction fetchUserGroups lorsque le popup s'ouvre
  };
  useEffect(() => {
    console.log('popupOpen:', popupOpen);
  }, [popupOpen]);

  
  const handlePopupClose = () => {
    setPopupOpen(false);
    setUserGroups([]); // Réinitialisation des groupes utilisateur lorsque le popup est fermé
  };

  const handlePopupToggle = () => {
    const updatedPopupOpen = !popupOpen;
    setPopupOpen(updatedPopupOpen);
    if (updatedPopupOpen) {
      handlePopupOpen();
    } else {
      handlePopupClose();
    }
  };

  const fetchUserGroups = async () => {
    const token = localStorage.getItem('token');
    if (token && authContext && authContext.user) {
      try {
        const response = await fetch(`/api/group?userId=${authContext.user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const { userGroups } = await response.json();
          console.log('userGroups from API:', userGroups); // Ajout d'un console.log pour vérifier les groupes récupérés depuis l'API
          setUserGroups(userGroups);
          console.log('userGroups state after API call:', userGroups); // Ajout d'un console.log pour vérifier l'état de userGroups après l'appel à l'API
        } else {
          console.error('Failed to fetch user groups');
        }
      } catch (error) {
        console.error('Failed to fetch user groups:', error);
      }
    }
  };

 

  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
  };
  const handleSave = () => {
    const newMarker = {
      lat: markers[markers.length - 1].lat,
      lng: markers[markers.length - 1].lng,
      name,
      description,
    };
    console.log('newMarker:', newMarker);

    // Envoi de données à l'API
    fetch('/api/spot/createSpot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'id', // Remplacez par l'ID de l'utilisateur approprié
        groupId: 'groupId', // Remplacez par l'ID du groupe approprié, si nécessaire
        name: newMarker.name,
        description: newMarker.description,
        latitude: newMarker.lat,
        longitude: newMarker.lng,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Spot created successfully:', data);
        setName('');
        setDescription('');
        setShowMessage(true);
        map.closePopup();
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      })
      .catch((error) => {
        console.error('Error creating spot:', error);
        // Gérer l'erreur ici en affichant un message d'erreur approprié à l'utilisateur
      });
  };

  return (
    <>
      {showMessage && (
        <div className="z-50 fixed top-1/2 right-0 transform translate-y-[850%] -translate-x-[500%] mr-1 bg-green-500 text-white py-2 px-8 rounded">
          Données enregistrées !
        </div>
      )}
       {markers.map((marker, index) => (
      <Marker key={index} position={[marker.lat, marker.lng]}>
        <Popup>
          <div className="p-4">
              <label className="block mb-2">
                <span className="text-gray-700">Nom:</span>
                <input
                  className="form-input mt-1 block w-full"
                  type="text"
                  value={name || ''}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Description:</span>
                <input
                  className="form-input mt-1 block w-full"
                  type="text"
                  value={description || ''}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Groupes:</span>
                <select
                  className="form-select mt-1 block w-full"
                  onChange={(e) => handleGroupChange(e.target.value)}
                >
                  <option value="">Sélectionnez un groupe</option>
                  {userGroups.map((group) => {
                    return (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    );
                  })}
                </select>
              </label>
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Enregistrer
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MapWithMarkerPopup;