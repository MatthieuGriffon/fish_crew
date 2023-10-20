import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../../contexts/AuthContext';

interface FormData {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
}

interface EditGroupProps {
    group: {
      id: string;
      name: string;
      description: string;
      isPublic: boolean;
    };
    onGroupUpdated: () => void;
}

const EditGroup: React.FC<EditGroupProps> = ({ group, onGroupUpdated }) => {
  const authContext = useContext(AuthContext);

  const [formData, setFormData] = useState<FormData>({
    id: group.id,
    name: group.name,
    description: group.description,
    isPublic: group.isPublic,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authContext || !authContext.user) {
      console.error("Contexte d'authentification ou utilisateur non défini");
      return;
    }

    try {
       
      const response = await fetch(`/api/groups/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        
        onGroupUpdated();
      } else {
        const data = await response.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error while updating the group:', error);
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
            Mettre à jour le groupe
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditGroup;
