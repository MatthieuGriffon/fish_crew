'use client'
import React from 'react';
import { AuthProvider, AuthContext } from '../../contexts/AuthContext';
import MapComponent from '../components/Map/MapComponent';



const MapLayout = () => {
  return (    
    <AuthProvider>
     
      {typeof window !== 'undefined' && <MapComponent />}
    </AuthProvider>
  );
};

export default MapLayout;