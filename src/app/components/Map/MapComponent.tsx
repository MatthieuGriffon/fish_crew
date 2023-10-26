'use client'
import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useMapEvents } from 'react-leaflet';
import { AuthContext } from '../../../contexts/AuthContext';
import { MarkerType, MarkerData  } from '../../../../types/marker';
import { LeafletMouseEvent } from 'leaflet';

const MapWithMarkerPopup = dynamic(() => import('./MapWithMarkerPopup'), {
  loading: () => <p>Loading MapWithMarkerPopup...</p>,
  ssr: false,
});

const MapComponent = () => {
  const authContext = useContext(AuthContext);
  console.log('authContext', authContext);
  const username = authContext && authContext.user ? authContext.user.username : 'Non connecté';
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [savedMarkers, setSavedMarkers] = useState<MarkerData[]>([]);

  const mapStyle: React.CSSProperties = {
    top: '50%',
    left: '50%',
    width: '80%',
    height: '70%',
    zIndex: 10,
  };

  const fetchMarkers = async () => {
    try {
      if (!authContext || !authContext.user) {
        console.log("L'utilisateur n'est pas connecté. Vous devez être connecté pour récupérer les marqueurs.");
        return;
      }
      const userId = authContext.user.id;
      console.log('userId du MapComponent', userId);
      const response = await fetch(`/api/spot/getMarkers?userId=${userId}`); // Assurez-vous de modifier le point de terminaison en conséquence
      console.log('response du FetchMarker',response)
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des marqueurs');
      }
      const data = await response.json();
      console.log('data du fetchMarker', data);
      setSavedMarkers(data);
    } catch (error) {
      console.error('Failed to fetch markers:', error);
    }
  };

  useEffect(() => {
    fetchMarkers();
    console.log('appel fonction recuperation des marqueur', fetchMarkers) 
  }, [authContext]);

  

  const handleClick = (e: LeafletMouseEvent) => {
    if (authContext && authContext.user) {
      const { lat, lng } = e.latlng;
      const newMarker = { lat, lng };
      setMarkers([...markers, newMarker]);
    } else {
      console.log("L'utilisateur n'est pas connecté. Vous devez être connecté pour ajouter des marqueurs.", username);
    }
  };

  const handleGeolocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      window.navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      });
    } else {
      console.error("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
  };

  const handleDeleteMarker = async (markerId: string) => {
    try {
      const response = await fetch(`/api/spot/deleteSpot?spotId=${markerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedMarkers = savedMarkers.filter((marker) => marker.id !== markerId);
      setSavedMarkers(updatedMarkers);
    } catch (error) {
      console.error('Failed to delete marker:', error);
    }
  };

  useEffect(() => {
    handleGeolocation();
  }, []);

  const MapView = () => {
    const map = useMap();
    if (userLocation) {
      map.setView(userLocation, 13);
    }
    return null;
  };

  const MapClickHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        handleClick(e);
      },
    });
    return null;
  };

  return (
    <div style={{ marginLeft: '5rem', height: '100vh', width: '90vw' }}>
      <div className="h-full" style={mapStyle}>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} style={{ width: '100%', height: '100%', zIndex: 10 }}>
          <MapClickHandler />
          <MapView />
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userLocation && <Marker position={userLocation}><Popup>Votre position actuelle.</Popup></Marker>}
          <MapWithMarkerPopup markers={markers} />
          {/* Ajoutez une section pour afficher les marqueurs sauvegardés ici */}
          <div>
          {savedMarkers.map((marker, index) => (
            <Marker key={index} position={[marker.latitude, marker.longitude]}>
              <Popup>
                {/* Insérez ici le contenu de la popup pour chaque marqueur sauvegardé */}
                <div className="flex flex-col items-center justify-center dark">
                  <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
                    {marker.user ? (
                      <h2 className="text-1xl font-bold text-gray-200 mb-4">Ajouté par: {marker.user.username}</h2>
                    ) : (
                      <h2 className="text-1xl font-bold text-gray-200 mb-4">Ajouté par: Utilisateur inconnu</h2>
                    )}
                    {marker.group ? (
                      <h2 className="text-1xl font-bold text-gray-200 mb-4">Groupe : {marker.group.name}</h2>
                    ) : (
                      <h2 className="text-1xl font-bold text-gray-200 mb-4">Groupe : N/A</h2>
                    )}
                    <h2 className="text-1xl font-bold text-gray-200 mb-4">Nom: {marker.name}</h2>
                    <h2 className="text-1xl font-bold text-gray-200 mb-4">Description : {marker.description}</h2>
                    {authContext && authContext.user && marker.userId === authContext.user.id && (
                      <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-red-600 hover:to-pink-600 transition ease-in-out duration-150" onClick={() => handleDeleteMarker(marker.id)}>
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
</div>
        </MapContainer>
      </div>
    </div>
  );
  
};

export default MapComponent;
