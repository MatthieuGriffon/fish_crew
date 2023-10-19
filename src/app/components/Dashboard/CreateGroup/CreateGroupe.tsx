import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../../contexts/AuthContext';
import { getToken } from '../../../utils/auth';


interface FormData {
    name: string;
    description: string;
    isPublic: boolean;
}

interface CreateGroupeProps {
  onGroupCreated: () => void;
}

const CreateGroupe: React.FC<CreateGroupeProps> = ({ onGroupCreated }) =>{
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    isPublic: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    const isCheckbox = type === "checkbox";
    
    setFormData(prevState => ({
      ...prevState,
      [name]: isCheckbox ? checked : value
    } as any));
}

const authContext = useContext(AuthContext);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Vérifier si authContext et authContext.user sont définis
  if (!authContext || !authContext.user) {
      console.error("Contexte d'authentification ou utilisateur non défini");
      return;
  }

  try {
    const response = await fetch('/api/groups/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        userId: authContext.user.id
      })
    });
    console.log('ID de l\'utilisateur:', authContext.user.id);

    if (response.ok) {
      const newGroup = await response.json();
      console.log('Group created:', newGroup);
      onGroupCreated();  // <-- Appeler la fonction ici
    } else {
      const data = await response.json();
      console.error(data.error);
    }
  } catch (error) {
    console.error('Error while creating the group:', error);
  }
}

  
  

  return (
    <div className="bg-black bg-opacity-50 p-6 rounded-md shadow-md w-[70%] mx-auto space-y-4 max-h-[60vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-lg text-white">Nom du groupe:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required 
                 className="p-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="description" className="text-lg text-white">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required 
                    className="p-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 h-28" />
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="focus:ring-blue-400" />
          <label className="text-lg text-white">Est-ce que le groupe est public?</label>
        </div>
        <div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400">
            Créer le groupe
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroupe;