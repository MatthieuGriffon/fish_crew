import React, { useState, ChangeEvent, FormEvent } from 'react';
import { EditProfileFormProps } from "../../../../types/editProfileForm"


const EditProfileForm: React.FC<EditProfileFormProps & { setIsEditing: (value: boolean) => void }> = ({ user, onSave, onCancel, setIsEditing }) => {
  const [formData, setFormData] = useState({
    username: user.username || '', 
    city: user.city || '',
    department: user.department || '',
    email: user.email || '',
  });



  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/updateUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          onSave(formData);
          setIsEditing(false);
        } else {
          console.error('La sauvegarde a échoué.');
        }
      } else {
        console.error('Aucun jeton d\'autorisation trouvé.');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="city" className="block font-semibold">Ville :</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="department" className="block font-semibold">Département :</label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block font-semibold">Adresse e-mail :</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="mt-4">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2">Enregistrer</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-gray-800 rounded-md">Annuler</button>
      </div>
    </form>
  );
};

export default EditProfileForm;
