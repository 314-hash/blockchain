
import React from 'react';

interface EditorProps {
    script: string;
    setScript: (script: string) => void;
}

const Editor: React.FC<EditorProps> = ({ script, setScript }) => {
    return (
        <div className="flex-grow flex flex-col bg-gray-800 rounded-lg shadow-inner w-full md:w-1/2">
            <div className="p-3 bg-gray-700 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-200">Script Editor</h2>
            </div>
            <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Write your story here..."
                className="flex-grow w-full p-4 bg-gray-800 text-gray-200 font-mono text-sm leading-6 resize-none focus:outline-none rounded-b-lg"
                spellCheck="false"
            />
        </div>
    );
};

export default Editor;
