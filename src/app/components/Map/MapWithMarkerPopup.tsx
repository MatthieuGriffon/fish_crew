import React, { useContext, useState, useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { AuthContext } from '@/contexts/AuthContext';
import { Group } from '../../../../types/user';
import { MarkerType } from '../../../../types/marker';



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
  const [fetchedMarkers, setFetchedMarkers] = useState<MarkerType[]>([]);
  const [refreshMap, setRefreshMap] = useState(false);

  let mapRef = useRef();

  const renderMarkers = () => {
  
    const map = mapRef.current;
    if (map) {
      console.log(map.leafletElement.getZoom());
      map.leafletElement._onResize(); 
    }
  };

  useEffect(() => {
    renderMarkers();
  }, [refreshMap]);

  useEffect(() => {
    const fetchMarkers = async () => {
      const token = localStorage.getItem('token');
      if (token && authContext && authContext.user) {
        try {
          const response = await fetch(`/api/spot/getMarkers?userId=${authContext.user?.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const { markers } = await response.json();
          setFetchedMarkers(markers);
          localStorage.setItem('fetchedMarkers', JSON.stringify(markers));
        } catch (error) {
          console.error('Failed to fetch markers:', error);
        }
      }
    };

    const storedMarkers = localStorage.getItem('fetchedMarkers');
    if (storedMarkers) {
      setFetchedMarkers(JSON.parse(storedMarkers));
    } else {
      fetchMarkers();
    }
  }, [authContext]);

  useEffect(() => {
    localStorage.setItem('fetchedMarkers', JSON.stringify(fetchedMarkers));
  }, [fetchedMarkers]);

  const fetchUserGroups = async () => {
    const token = localStorage.getItem('token');
    if (token && authContext && authContext.user) {
      try {
        const response = await fetch(`/api/group?userId=${authContext.user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const { userGroups } = await response.json();
        setUserGroups(userGroups);
      } catch (error) {
        console.error('Failed to fetch user groups:', error);
      }
    }
  };

  useEffect(() => {
    const storedUserGroups = localStorage.getItem('userGroups');
    if (storedUserGroups) {
      setUserGroups(JSON.parse(storedUserGroups));
    } else {
      fetchUserGroups();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userGroups', JSON.stringify(userGroups));
  }, [userGroups]);

  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
  };

  const handleSave = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!authContext || !authContext.user || !authContext.user.id) {
      console.error("L'utilisateur n'est pas correctement authentifié.");
      return;
    }

    const newMarker = {
      latitude: markers[markers.length - 1]?.lat,
      longitude: markers[markers.length - 1]?.lng,
      name,
      description,
      groupId: selectedGroup,
      userId: authContext.user.id,
    };

    if (newMarker.latitude === undefined || newMarker.longitude === undefined) {
      console.error("La valeur de latitude ou de longitude n'est pas définie correctement.");
      return;
    }

    console.log('données à envoyer à createSpot API:', newMarker);

    fetch('/api/spot/createSpot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMarker),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setName('');
        setDescription('');
        setShowMessage(true);
        map.closePopup();
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);

        const storedMarkers = localStorage.getItem('fetchedMarkers');
        const parsedMarkers = storedMarkers ? JSON.parse(storedMarkers) : [];
        const updatedMarkers = [...parsedMarkers, newMarker];
        localStorage.setItem('fetchedMarkers', JSON.stringify(updatedMarkers));
      })
      .catch((error) => {
        console.error('Error creating spot:', error);
      });
    setRefreshMap(true);
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
            <div className="flex flex-col items-center justify-center dark">
              <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-200 mb-4">Nouveau Marqueur</h2>

                <form className="flex flex-col">
                  <input
                    placeholder="Nom"
                    className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                    type="text"
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    placeholder="Description"
                    className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                    type="text"
                    value={description || ''}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <select
                    className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                    onChange={(e) => handleGroupChange(e.target.value)}
                    onFocus={() => {
                      fetchUserGroups();
                    }}
                  >
                    <option key="default" value="">
                      Sélectionnez un groupe
                    </option>
                    {userGroups.map((group) => (
                      <option key={group.group.id} value={group.group.id || ''}>
                        {group.group.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                    onClick={handleSave}
                  >
                    Enregistrer
                  </button>
                </form>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      {fetchedMarkers &&
        fetchedMarkers.map((marker, index) => (
          <Marker key={index + markers.length} position={[marker.lat, marker.lng]}>
            <Popup>
              <div>
                <h2>Nom : {marker.name}</h2>
                <p>Description : {marker.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  );
};

export default MapWithMarkerPopup;
