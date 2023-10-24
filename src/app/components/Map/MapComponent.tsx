'use client'
import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import dynamic from 'next/dynamic';
import { useMapEvents } from 'react-leaflet';
import { AuthProvider, AuthContext } from '../../../contexts/AuthContext';


const MapWithMarkerPopup = dynamic(() => import('./MapWithMarkerPopup'), { loading: () => <p>Loading MapWithMarkerPopup...</p>, ssr: false });

const Map = () => {
  const authContext = useContext(AuthContext);
  const username = authContext && authContext.user ? authContext.user.username : 'Non connecté';
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  
  
  const mapStyle: React.CSSProperties = {
    top: '50%',
    left: '50%',
    width: '80%',
    height: '70%',
    zIndex: 10,
  };

  type MarkerType = {
    lat: number;
    lng: number;
  };
  

  const handleClick = (e: any) => {
    if (authContext && authContext.user) {
      const { lat, lng } = e.latlng;
      const newMarker = { lat, lng };
      setMarkers([...markers, newMarker]);
    } else {
      console.log("L'utilisateur n'est pas connecté. Vous devez être connecté pour ajouter des marqueurs.", username);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('geolocation' in navigator) {
        window.navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        });
      } else {
        console.error("La géolocalisation n'est pas prise en charge par votre navigateur.");
      }
    }
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
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <MapClickHandler />
            <MapView />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>Votre position actuelle.</Popup>
              </Marker>
            )}
            <MapWithMarkerPopup markers={markers} />
          </MapContainer>       
        </div>
    </div>
  );
};

const MapLayout = () => {

  const authContext = useContext(AuthContext);
  return (
    

    <div>
     
    <AuthProvider>
      <Map />
    </AuthProvider>

    </div>
  

  );
};

export default MapLayout;
