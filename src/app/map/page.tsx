'use client'
import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from '../../contexts/AuthContext';
import MapComponent from '../components/Map/MapComponent';

const NoSSR = dynamic(() => import('../components/Map/MapComponent'), { ssr: false });

const MapLayout = () => {
  return (    
    <AuthProvider>
      {typeof window !== 'undefined' && <NoSSR />}
      {typeof window !== 'undefined' && <MapComponent />}
    </AuthProvider>
  );
};

export default MapLayout;