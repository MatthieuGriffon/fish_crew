import { type } from "os";

// types/marker.d.ts
export interface MarkerType {
  id: string;
    lat: number;
    lng: number;
    name?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    groupId?: string | null;
  userId?: string;
  }
 

export type Marker = {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
    description: string;
    groupId: string | null;
    userId: string;
};
export interface MarkerData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  groupId: string;
  userId: string;
  group?: {
    name?: string;
  };
  user?: {
    username: string;
  };
  // Ajoutez d'autres propriétés ici si nécessaire
}
  