import React, { FC, useState } from 'react';

interface AddMemberModalProps {
    isOpen: boolean;
    onAdd: (email: string) => void;
    onCancel: () => void;
}

const AddMemberModal: FC<AddMemberModalProps> = ({ isOpen, onAdd, onCancel }) => {
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-100 rounded-lg shadow-md p-6 w-[20%] mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Ajouter un membre</h2>
                <div className="mb-4">
                    <label className="block text-white mb-2">Email de l'utilisateur</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-2 py-1 rounded text-black" 
                        placeholder="Entrez l'email de l'utilisateur"/>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => onAdd(email)}
                    >
                        Ajouter
                    </button>
                    <button
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                        onClick={onCancel}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddMemberModal;
