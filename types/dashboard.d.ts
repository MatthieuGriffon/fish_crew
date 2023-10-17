export type ProfileSectionProps = {
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
    isEditing: boolean;
    setIsEditing: boolean;
  };
  
  
export type User = {
    id: string | null;
    username: string | null;
    email: string | null;
    city: string | null;
    department: string | null;
    role: {
      name: string | null;
    } | null;
    setIsEditing: boolean;
  };
  