export interface EditProfileFormProps {
    user: {
      username: string | null;
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