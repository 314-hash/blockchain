
export type ScriptLine =
    | { type: 'scene'; sceneId: string }
    | { type: 'show'; characterId: string; position: string }
    | { type: 'hide'; characterId: string }
    | { type: 'dialogue'; characterId: string | null; text: string };

const SCENE_REGEX = /^scene\s+(.+)/i;
const SHOW_REGEX = /^show\s+(\w+)(?:\s+at\s+(\w+))?/i;
const HIDE_REGEX = /^hide\s+(.+)/i;
const DIALOGUE_REGEX = /^(\w+)\s+"(.+)"/;
const NARRATION_REGEX = /^"(.+)"/;

export const parseScript = (script: string): ScriptLine[] => {
    const lines = script.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const parsedLines: ScriptLine[] = [];

    for (const line of lines) {
        let match;

        match = line.match(SCENE_REGEX);
        if (match) {
            parsedLines.push({ type: 'scene', sceneId: match[1].trim() });
            continue;
        }
        
        match = line.match(SHOW_REGEX);
        if (match) {
            parsedLines.push({ type: 'show', characterId: match[1].trim(), position: match[2] || 'center' });
            continue;
        }

        match = line.match(HIDE_REGEX);
        if (match) {
            parsedLines.push({ type: 'hide', characterId: match[1].trim() });
            continue;
        }

        match = line.match(DIALOGUE_REGEX);
        if (match) {
            parsedLines.push({ type: 'dialogue', characterId: match[1].trim(), text: match[2] });
            continue;
        }

        match = line.match(NARRATION_REGEX);
        if (match) {
            parsedLines.push({ type: 'dialogue', characterId: null, text: match[1] });
            continue;
        }
    }
    
    return parsedLines;
};
