'use client'
import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
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