import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string |null;
  username: string | null;
  email: string | null;
  city: string | null;
  department: string | null;
}
export interface ProfileSectionPropsWithoutRole {
  toggleEditing: () => void;
  user: {
    username: string | null;
    email: string | null;
    city: string | null;
    department: string | null;
  } | null;
  isEditing: boolean;
}


interface EditProfileFormProps {
  user: {
    username: string;
    city: string | null;
    department: string | null;
    email: string | null;
  };
  onSave: (formData: {
    username: string;
    city: string;
    department: string;
    email: string;
  }) => void;
  onCancel: () => void;
}

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateUser?: (userData: User) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch('/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();

            const updatedUser: User = {
              id: userData.id,
              username: userData.username,
              email: userData.email,
              city: userData.city !== undefined ? userData.city : null,
              department: userData.department !== undefined ? userData.department : null,
            };

            setUser(updatedUser);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
