import React, { useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';

interface MarkerType {
  lat: number;
  lng: number;
}

interface MapWithMarkerPopupProps {
  markers: MarkerType[];
}

const MapWithMarkerPopup: React.FC<MapWithMarkerPopupProps> = ({ markers }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const map = useMap();
  
    const handleSave = () => {
      const newMarker = { lat: markers[markers.length - 1].lat, lng: markers[markers.length - 1].lng, name, description };
      // Vous pouvez ajouter votre logique de gestion de données enregistrées ici.
      setName('');
      setDescription('');
      setShowMessage(true);
      map.closePopup(); // Fermer le popup
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Fermez le message après 3 secondes.
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
