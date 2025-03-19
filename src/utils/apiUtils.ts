import { GoogleGenerativeAI } from '@google/generative-ai';
import { StylePreset } from '@/types';
import { fileToBase64 } from './imageUtils';

export const testApiConnection = async (apiKey: string): Promise<boolean> => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test connection");
    return !!result;
  } catch (error) {
    console.error('API key validation error:', error);
    throw error;
  }
};

export const transformImage = async (
  apiKey: string,
  file: File,
  selectedStyle: string,
  stylePresets: StylePreset[],
  customInstructions: string
): Promise<string> => {
  try {
    // Initialize the Google Generative AI client with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the image generation model with proper configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ['Text', 'Image'],
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });
    
    // Convert the image file to base64
    const base64Image = await fileToBase64(file);
    
    // Construct prompt based on selected style and custom instructions
    const selectedStyleInfo = stylePresets.find(style => style.id === selectedStyle);
    let prompt = `Transform this room photo into a ${selectedStyleInfo?.name} style (${selectedStyleInfo?.description}). Generate a new image.`;
    
    if (customInstructions) {
      prompt += ` ${customInstructions}`;
    }
    
    // Prepare parts for the prompt
    const parts = [
      {
        inlineData: {
          mimeType: file.type,
          data: base64Image.split(',')[1]
        }
      },
      { text: prompt }
    ];
    
    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });
    
    const response = result.response;
    console.log("API Response:", response);
    
    // Look for the image part in the response
    const responseParts = response.candidates?.[0]?.content?.parts;
    if (responseParts && responseParts.length > 0) {
      for (const part of responseParts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${imageData}`;
        }
      }
    }
    
    throw new Error('No image was generated in the response');
  } catch (error) {
    console.error('Error transforming image:', error);
    throw error;
  }
};
