import { type } from "os";

// types/marker.d.ts
export interface MarkerType {
    lat: number;
    lng: number;
    name?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
  }

export type Marker = {
  latitude: number;
  longitude: number;
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
  