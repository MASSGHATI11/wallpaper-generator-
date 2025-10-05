import { GoogleGenAI } from "@google/genai";
import { AdvancedPromptOptions } from "../App";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const basePrompt = "Generate a short, creative, visually descriptive prompt for an AI image generator to create a stunning and unique wallpaper. The prompt should be a single sentence.";
const styleSuffix = 'Focus on dreamlike or surreal landscapes, abstract concepts, or futuristic cityscapes. Example: "A bioluminescent forest where the trees pulse with soft, ethereal light."';


export const generateCreativePrompt = async (category: string = 'Featured', options: AdvancedPromptOptions): Promise<string> => {
    let prompt = basePrompt;
    
    // 1. Add category context
    if (category && category !== 'Featured') {
        prompt += ` The category is "${category}".`;
    } else {
        prompt += ` ${styleSuffix}`;
    }

    // 2. Add advanced options context
    if (options.artStyle && options.artStyle !== 'Any') {
        prompt += ` The art style should be ${options.artStyle}.`;
    }
    if (options.colorPalette && options.colorPalette !== 'Any') {
        prompt += ` Use a ${options.colorPalette} color palette.`;
    }
    
    const detailMap: { [key: number]: string } = {
        1: 'minimalist with very few details',
        2: 'simple and clean',
        3: 'balanced in detail',
        4: 'highly detailed',
        5: 'intricate and complex with hyper-detailed elements'
    };
    const detailText = detailMap[options.detailLevel];
    if (detailText) {
        prompt += ` The level of detail should be ${detailText}.`;
    }


    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text.trim().replace(/^"|"$/g, ''); // Trim quotes if present
    } catch (error: any) {
        console.error("Error generating creative prompt:", error);

        const errorString = (typeof error === 'object' && error !== null) ? JSON.stringify(error) : String(error);
        if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
            throw new Error("QUOTA_EXHAUSTED");
        }
        
        throw new Error("Failed to generate a creative prompt.");
    }
};

export const generateImage = async (prompt: string, size: string = 'Laptop'): Promise<string> => {
    const aspectRatio = size === 'Phone' ? '9:16' : '16:9';
    const promptPrefix = size === 'Phone' 
        ? 'Phone wallpaper, 9:16 aspect ratio' 
        : 'Wallpaper, 16:9 aspect ratio';

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `${promptPrefix}, high resolution, stunning digital art, masterpiece. Prompt: ${prompt}`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error: any) {
        console.error("Error generating image:", error);
        
        const errorString = (typeof error === 'object' && error !== null) ? JSON.stringify(error) : String(error);

        if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
            throw new Error("QUOTA_EXHAUSTED");
        }

        throw new Error("Failed to generate an image from the prompt.");
    }
};