import React, { FC } from 'react';

export interface ConfirmModalProps {
    isOpen: boolean;
    title: string; // Assurez-vous que 'title' est inclus ici
    content: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
  }

const ConfirmModal: FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg w-96">
                <p className="mb-4">
                    Êtes-vous sûr de vouloir supprimer le groupe ? Toutes les informations du groupe seront définitivement perdues.
                </p>
                <div className="flex justify-end space-x-2">
                    <button onClick={onCancel} className="px-3 py-1 rounded bg-gray-300">Annuler</button>
                    <button onClick={onConfirm} className="px-3 py-1 rounded bg-red-600 text-white">Confirmer</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
  