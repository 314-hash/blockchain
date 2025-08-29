
import React, { useState } from 'react';
import { Character, Scene } from '../types';
import Modal from './Modal';
import { PlusIcon, CloseIcon } from './Icons';

interface SidebarProps {
    characters: Character[];
    scenes: Scene[];
    onAddCharacter: (name: string, image: string) => void;
    onAddScene: (name: string, image: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const AssetForm: React.FC<{
    assetType: 'Character' | 'Scene';
    onAdd: (name: string, image: string) => void;
    onClose: () => void;
}> = ({ assetType, onAdd, onClose }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [fileError, setFileError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setFileError('File size exceeds 2MB limit.');
                return;
            }
            setFileError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name && image) {
            onAdd(name, image);
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-100">Add New {assetType}</h2>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} required className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"/>
                {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                {image && <img src={image} alt="Preview" className="mt-2 rounded-md max-h-40 object-contain" />}
            </div>
            <div className="flex justify-end gap-4 pt-4">
                 <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition">Add {assetType}</button>
            </div>
        </form>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ characters, scenes, onAddCharacter, onAddScene, isOpen, onClose }) => {
    const [isCharModalOpen, setCharModalOpen] = useState(false);
    const [isSceneModalOpen, setSceneModalOpen] = useState(false);
    
    const sidebarClasses = `
        bg-gray-800 p-4 overflow-y-auto flex-shrink-0
        transition-transform transform duration-300 ease-in-out
        w-64 fixed inset-y-0 left-0 z-30
        md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    return (
        <aside className={sidebarClasses}>
            <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="text-xl font-bold text-purple-400">Assets</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition" aria-label="Close sidebar">
                    <CloseIcon />
                </button>
            </div>
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-purple-300">Characters</h3>
                    <button onClick={() => setCharModalOpen(true)} className="p-1 rounded-full hover:bg-gray-700 transition"><PlusIcon /></button>
                </div>
                <ul className="space-y-2">
                    {characters.map(char => (
                        <li key={char.id} className="flex items-center space-x-2 bg-gray-700/50 p-2 rounded">
                            <img src={char.image} alt={char.name} className="w-8 h-8 rounded-full object-cover" />
                            <span className="text-sm">{char.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-purple-300">Scenes</h3>
                     <button onClick={() => setSceneModalOpen(true)} className="p-1 rounded-full hover:bg-gray-700 transition"><PlusIcon /></button>
                </div>
                <ul className="space-y-2">
                    {scenes.map(scene => (
                        <li key={scene.id} className="flex items-center space-x-2 bg-gray-700/50 p-2 rounded">
                             <img src={scene.image} alt={scene.name} className="w-8 h-8 rounded object-cover" />
                            <span className="text-sm">{scene.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <Modal isOpen={isCharModalOpen} onClose={() => setCharModalOpen(false)}>
                <AssetForm assetType="Character" onAdd={onAddCharacter} onClose={() => setCharModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={isSceneModalOpen} onClose={() => setSceneModalOpen(false)}>
                <AssetForm assetType="Scene" onAdd={onAddScene} onClose={() => setSceneModalOpen(false)} />
            </Modal>

        </aside>
    );
};

export default Sidebar;
