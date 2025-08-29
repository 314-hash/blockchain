
import { GoogleGenAI } from "@google/genai";
import { Character, Scene } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateStorySnippet = async (prompt: string, characters: Character[], scenes: Scene[]): Promise<string> => {
    if (!process.env.API_KEY) {
        return "Error: Gemini API key is not configured.";
    }

    const characterNames = characters.map(c => c.name).join(', ') || 'none';
    const sceneNames = scenes.map(s => s.name).join(', ') || 'none';

    const systemInstruction = `You are an assistant for writing visual novel scripts.
Your output MUST follow the specified format. Do not include any explanations.
- To set a background, use: scene SceneName
- To show a character, use: show CharacterName
- To hide a character, use: hide CharacterName
- For character dialogue, use: CharacterName "Dialogue text goes here."
- For narration, use: "Narration text goes here."

Available Characters: ${characterNames}
Available Scenes: ${sceneNames}

Generate a script snippet based on the user's request.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return `Error: Could not generate story. ${error instanceof Error ? error.message : String(error)}`;
    }
};

export default generateStorySnippet;
