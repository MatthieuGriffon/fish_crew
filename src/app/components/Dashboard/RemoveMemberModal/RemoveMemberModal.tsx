import React, { FC } from 'react';

interface RemoveMemberModalProps {
    isOpen: boolean;
    memberName?: string;
    onRemove: () => void;
    onCancel: () => void;
}

const RemoveMemberModal: FC<RemoveMemberModalProps> = ({ isOpen,memberName, onRemove, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-100 rounded-lg shadow-md p-6 w-[20%] mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Supprimer un membre</h2>
                <p className="text-white mb-4">Êtes-vous sûr de vouloir supprimer {memberName}  du groupe ?</p>
                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        onClick={onRemove}
                    >
                        Supprimer
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

export default RemoveMemberModal;