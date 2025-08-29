
import React, { useState, useCallback } from 'react';
import { Character, Scene } from './types';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AIAssist from './components/AIAssist';
import Player from './components/Player';
import { parseScript, ScriptLine } from './hooks/useScriptParser';
import { MenuIcon } from './components/Icons';

const initialScript = `scene Bedroom
show Alice
Alice "Ugh, another Monday morning. I wish I could just stay in bed forever."
"The sun streamed through the window, offering no sympathy for her plight."
show Bob
Bob "Morning, sleepyhead! I made coffee."
Alice "You're a lifesaver, Bob. Seriously."
hide Bob
Alice "Okay, world. Let's do this... I guess."
`;


const App: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([
        { id: 'Alice', name: 'Alice', image: 'https://picsum.photos/seed/alice/400/600' },
        { id: 'Bob', name: 'Bob', image: 'https://picsum.photos/seed/bob/400/600' }
    ]);
    const [scenes, setScenes] = useState<Scene[]>([
        { id: 'Bedroom', name: 'Bedroom', image: 'https://picsum.photos/seed/bedroom/1280/720' },
        { id: 'Cafe', name: 'Cafe', image: 'https://picsum.photos/seed/cafe/1280/720' }
    ]);
    const [script, setScript] = useState<string>(initialScript);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [parsedScript, setParsedScript] = useState<ScriptLine[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleAddCharacter = (name: string, image: string) => {
        const newChar: Character = { id: name, name, image };
        setCharacters(prev => [...prev, newChar]);
    };

    const handleAddScene = (name: string, image: string) => {
        const newScene: Scene = { id: name, name, image };
        setScenes(prev => [...prev, newScene]);
    };

    const handlePlay = useCallback(() => {
        setParsedScript(parseScript(script));
        setIsPlaying(true);
    }, [script]);

    const insertAIText = useCallback((text: string) => {
        setScript(prev => prev + '\n' + text);
    }, []);

    return (
        <div className="h-screen bg-gray-900 text-gray-200 flex flex-col">
            <header className="bg-gray-800 shadow-lg p-4 flex justify-between items-center z-20 shrink-0">
                <div className="flex items-center gap-4">
                     <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-1 -ml-1 rounded-full hover:bg-gray-700 transition"
                        aria-label="Open sidebar"
                    >
                        <MenuIcon />
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-purple-400">Novel RenPy</h1>
                </div>
                <button
                    onClick={handlePlay}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    <span className="hidden sm:inline">Play Novel</span>
                    <span className="sm:hidden">Play</span>
                </button>
            </header>

            <main className="flex-grow flex relative overflow-hidden">
                <Sidebar
                    characters={characters}
                    scenes={scenes}
                    onAddCharacter={handleAddCharacter}
                    onAddScene={handleAddScene}
                    isOpen={isSidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
                 {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-20 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}
                <div className="flex-grow flex flex-col md:flex-row p-4 gap-4">
                    <Editor script={script} setScript={setScript} />
                    <AIAssist onInsertText={insertAIText} characters={characters} scenes={scenes} />
                </div>
            </main>

            {isPlaying && (
                <Player
                    script={parsedScript}
                    characters={characters}
                    scenes={scenes}
                    onClose={() => setIsPlaying(false)}
                />
            )}
        </div>
    );
};

export default App;
