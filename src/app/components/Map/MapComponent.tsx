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
                <div>
                {marker.user ? (
                  <h4>Ajouté par: {marker.user.username}</h4>
                ) : (
                  <h4>Ajouté par: Utilisateur inconnu</h4>
                )}
                {marker.group ? (
                  <h3>Groupe : {marker.group.name}</h3>
                ) : (
                  <h3>Groupe : N/A</h3>
                )}
                <h3>Nom: {marker.name}</h3>
                <h3>Description : {marker.description}</h3>
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
