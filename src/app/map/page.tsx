'use client'
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from '../../contexts/AuthContext';
import MapComponent from '../../app/components/Map/MapComponent';

const MapLayout = () => {
  const authContext = useContext(AuthContext);
  return (
    <AuthProvider>
      <MapComponent authContext={authContext} />
    </AuthProvider>
  );
};

export default MapLayout;