import React, { FC } from 'react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-100 rounded-lg shadow-md p-6 w-[20%] mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Supprimer le groupe</h2>
                <p className="text-white">Etes-vous sûr de vouloir supprimer complètement le groupe?</p>
                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        onClick={onConfirm}
                    >
                        Confirmer
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

export default ConfirmDeleteModal;
