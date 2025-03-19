import { GoogleGenerativeAI } from '@google/generative-ai';

// Function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const testConnection = async (apiKey: string): Promise<boolean> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent("Test connection");
  return !!result;
};

export const transformImage = async (
  apiKey: string,
  file: File,
  styleName: string,
  styleDescription: string,
  customInstructions: string
): Promise<string> => {
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
  let prompt = `Transform this room photo into a ${styleName} style (${styleDescription}). Generate a new image.`;
  
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
  
  // Check for images in the response
  const responseParts = response.candidates?.[0]?.content?.parts;
  if (responseParts && responseParts.length > 0) {
    // Look for the image part in the response
    for (const part of responseParts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${imageData}`;
      }
    }
    throw new Error('No image was generated in the response');
  } else {
    throw new Error('Invalid response format from Gemini API');
  }
};
