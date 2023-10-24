import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';

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

 
    return (
      <>
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
              </div>
            </Popup>
          </Marker>
        ))}
      </>
    );
  
  return null;
};

export default MapWithMarkerPopup;
