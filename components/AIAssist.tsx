
import React, { useState } from 'react';
import generateStorySnippet from '../services/geminiService';
import { SparklesIcon } from './Icons';
import { Character, Scene } from '../types';

interface AIAssistProps {
    onInsertText: (text: string) => void;
    characters: Character[];
    scenes: Scene[];
}

const AIAssist: React.FC<AIAssistProps> = ({ onInsertText, characters, scenes }) => {
    const [prompt, setPrompt] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError('');
        setGeneratedText('');
        try {
            const result = await generateStorySnippet(prompt, characters, scenes);
            if (result.startsWith('Error:')) {
                setError(result);
            } else {
                setGeneratedText(result);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full md:w-1/2 flex flex-col bg-gray-800 rounded-lg shadow-inner">
            <div className="p-3 bg-gray-700 rounded-t-lg flex items-center gap-2">
                <SparklesIcon />
                <h2 className="text-lg font-semibold text-gray-200">AI Assist</h2>
            </div>
            <div className="p-4 flex-grow flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Write a scene where Alice meets Bob in a cafe."
                    className="w-full h-24 p-2 bg-gray-900 text-gray-200 font-sans rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Generate Snippet'
                    )}
                </button>
                {(generatedText || error) && (
                    <div className="flex-grow flex flex-col bg-gray-900 rounded-md p-2">
                        {error && <p className="text-red-400 p-2">{error}</p>}
                        {generatedText && (
                            <textarea
                                readOnly
                                value={generatedText}
                                className="flex-grow w-full p-2 bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none"
                            />
                        )}
                        {generatedText && (
                           <button onClick={() => onInsertText(generatedText)} className="mt-2 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition">
                                Insert into Script
                           </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAssist;
