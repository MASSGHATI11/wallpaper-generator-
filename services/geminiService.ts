
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCreativePrompt = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate a short, creative, visually descriptive prompt for an AI image generator to create a stunning and unique wallpaper. The prompt should be a single sentence focusing on dreamlike or surreal landscapes, abstract concepts, or futuristic cityscapes. Example: "A bioluminescent forest where the trees pulse with soft, ethereal light."'
        });
        return response.text.trim().replace(/^"|"$/g, ''); // Trim quotes if present
    } catch (error) {
        console.error("Error generating creative prompt:", error);
        throw new Error("Failed to generate a creative prompt.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `Wallpaper, 16:9 aspect ratio, high resolution, stunning digital art, masterpiece. Prompt: ${prompt}`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate an image from the prompt.");
    }
};
