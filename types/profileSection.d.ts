export interface ProfileSectionProps {
    toggleEditing: () => void;
    user: {
      username: string | null;
      email: string | null;
      city: string | null;
      department: string | null;
    
      role: {
        name: string | null;
      } | null;
    } | null;
    handleSaveEdit: (updatedUserData: {
      username: string;
      city: string;
      department: string;
      email: string;
    }) => Promise<void>; 
    handleCancelEdit: () => void;
    isEditing: boolean; 
    
  }