
import React, { useState, useEffect, useMemo } from 'react';
import { Character, Scene } from '../types';
import { ScriptLine } from '../hooks/useScriptParser';
import { CloseIcon } from './Icons';

interface PlayerProps {
    script: ScriptLine[];
    characters: Character[];
    scenes: Scene[];
    onClose: () => void;
}

const Player: React.FC<PlayerProps> = ({ script, characters, scenes, onClose }) => {
    const [lineIndex, setLineIndex] = useState(0);
    const [currentScene, setCurrentScene] = useState<Scene | null>(null);
    const [visibleCharacters, setVisibleCharacters] = useState<Map<string, Character>>(new Map());
    const [dialogue, setDialogue] = useState<{ speaker: string | null; text: string } | null>(null);
    const [displayedText, setDisplayedText] = useState('');

    const charactersMap = useMemo(() => new Map(characters.map(c => [c.id, c])), [characters]);
    const scenesMap = useMemo(() => new Map(scenes.map(s => [s.id, s])), [scenes]);

    useEffect(() => {
        const processScript = () => {
            let scene: Scene | null = null;
            const visibleChars = new Map<string, Character>();
            let dialogueLine: { speaker: string | null; text: string } | null = null;
            
            for (let i = 0; i <= lineIndex && i < script.length; i++) {
                const line = script[i];
                switch (line.type) {
                    case 'scene':
                        scene = scenesMap.get(line.sceneId) || null;
                        break;
                    case 'show':
                        const charToShow = charactersMap.get(line.characterId);
                        if (charToShow) visibleChars.set(line.characterId, charToShow);
                        break;
                    case 'hide':
                        visibleChars.delete(line.characterId);
                        break;
                    case 'dialogue':
                        const speaker = line.characterId ? (charactersMap.get(line.characterId)?.name || line.characterId) : null;
                        dialogueLine = { speaker, text: line.text };
                        break;
                }
            }
            
            setCurrentScene(scene);
            setVisibleCharacters(new Map(visibleChars));
            setDialogue(dialogueLine);
        };
        
        processScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lineIndex, script, charactersMap, scenesMap]);

    useEffect(() => {
        if (!dialogue) {
            setDisplayedText('');
            return;
        }
        setDisplayedText(''); // Reset on new dialogue
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < dialogue.text.length) {
                setDisplayedText(prev => prev + dialogue.text.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 30);
        return () => clearInterval(typingInterval);
    }, [dialogue]);


    const handleNext = () => {
        if (dialogue && displayedText !== dialogue.text) {
             setDisplayedText(dialogue.text);
        } else {
            if (lineIndex < script.length - 1) {
                setLineIndex(prev => prev + 1);
            } else {
                onClose();
            }
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in" onClick={handleNext}>
            <div className="relative w-full h-full md:aspect-video md:max-w-screen-lg md:max-h-[90vh] md:h-auto md:rounded-lg bg-gray-800 shadow-2xl overflow-hidden cursor-pointer" onClick={e => e.stopPropagation()}>
                {/* Background */}
                <div className="absolute inset-0 transition-opacity duration-1000">
                    {currentScene && <img src={currentScene.image} alt={currentScene.name} className="w-full h-full object-cover" />}
                </div>

                {/* Characters */}
                <div className="absolute inset-0 flex justify-center items-end">
                    {Array.from(visibleCharacters.values()).map(char => (
                        <img key={char.id} src={char.image} alt={char.name} className="h-4/6 md:h-5/6 object-contain animate-slide-up" style={{maxWidth: '40%'}}/>
                    ))}
                </div>

                {/* Dialogue Box */}
                {dialogue && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8" onClick={handleNext}>
                        <div className="bg-black/70 p-4 md:p-6 rounded-lg border border-purple-500/30 shadow-lg text-white animate-slide-up">
                            {dialogue.speaker && <h3 className="text-xl md:text-2xl font-bold mb-2 text-purple-300">{dialogue.speaker}</h3>}
                            <p className="text-base md:text-xl leading-relaxed">{displayedText}</p>
                        </div>
                    </div>
                )}
                 
                 {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition z-10" aria-label="Close player">
                    <CloseIcon />
                </button>
            </div>
        </div>
    );
};

export default Player;
