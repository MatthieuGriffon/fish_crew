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
  };
  
  
export type User = {
    username: string | null;
    email: string | null;
    city: string | null;
    department: string | null;
    role: {
      name: string | null;
    } | null;
  };
  