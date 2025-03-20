import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import { STYLE_PRESETS } from '@/constants/stylePresets';
import { toast } from 'sonner'; // Direct import
import * as geminiService from '@/services/geminiService';
import { encryptApiKey, decryptApiKey } from '@/utils/cryptoUtils';

type TransformContextType = {
  apiKey: string;
  setApiKey: (key: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  customInstructions: string;
  setCustomInstructions: (instructions: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  transformedImage: string | null;
  setTransformedImage: (image: string | null) => void;
  history: Array<{ original: string; transformed: string }>;
  setHistory: React.Dispatch<React.SetStateAction<Array<{ original: string; transformed: string }>>>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (event: React.DragEvent) => void;
  handleDragOver: (event: React.DragEvent) => void;
  handleClear: () => void;
  handleTransform: (useLastGenerated?: boolean) => Promise<void>;
  handleTestConnection: () => Promise<void>;
  handleDownloadImage: () => void;
  saveApiKey: () => void;
  isSettingsPanelOpen: boolean;
  setIsSettingsPanelOpen: (open: boolean) => void;
  persistApiKey: boolean;
  setPersistApiKey: (persist: boolean) => void;
};

const TransformContext = createContext<TransformContextType | undefined>(undefined);

export const TransformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('minimalist');
  const [customInstructions, setCustomInstructions] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ original: string; transformed: string }>>([]);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [persistApiKey, setPersistApiKey] = useState(false);
  
  // Add a ref to track if this is the initial load
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    // Check only localStorage on initial load
    const savedEncryptedApiKey = localStorage.getItem('geminiApiKey');
    if (savedEncryptedApiKey) {
      setApiKey(decryptApiKey(savedEncryptedApiKey));
      setPersistApiKey(true); // If we found a saved key, persist setting should be true
    }
    
    // After initial setup is complete
    setTimeout(() => {
      isInitialLoadRef.current = false;
    }, 500);
  }, []);

  // Effect to handle toggling the persist setting
  useEffect(() => {
    // Skip during initial load to prevent unwanted behavior
    if (isInitialLoadRef.current) return;
    
    if (!persistApiKey) {
      // When toggling OFF, always remove from localStorage
      if (localStorage.getItem('geminiApiKey')) {
        localStorage.removeItem('geminiApiKey');
        toast.info('API key removed from browser storage. It will only be available for this session.');
      }
    } else {
      // When toggling ON, just show info but don't save - that happens with Save button
      toast.info('API key will be saved to browser storage when you click Save.');
    }
  }, [persistApiKey]);

  // Update saveApiKey function to handle the persistApiKey preference
  const saveApiKey = () => {
    if (apiKey) {
      if (persistApiKey) {
        // Only save to localStorage if persistApiKey is true
        localStorage.setItem('geminiApiKey', encryptApiKey(apiKey));
        toast.success('API key saved to browser storage');
      } else {
        // Just keep in memory and notify user
        localStorage.removeItem('geminiApiKey'); // Ensure any previous key is removed
        toast.success('API key will be used for this session only');
      }
    } else {
      // Clear storage if the API key is empty
      localStorage.removeItem('geminiApiKey');
      toast.info('API key cleared');
    }
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('apiKeySaved'));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // Simple toast call
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Only JPG, PNG, and WebP files are supported');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Only JPG, PNG, and WebP files are supported');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTransformedImage(null);
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      toast.error('Please enter your API key');
      // Also log to console for debugging
      console.log('Toast shown: Please enter your API key');
      return;
    }
    
    try {
      await geminiService.testConnection(apiKey);
      toast.success('API connection successful! Your API key is valid.');
      console.log('Toast shown: API connection successful');
    } catch (error) {
      console.error('API key validation error:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Invalid API key or insufficient permissions';
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
          errorMessage = 'Invalid API key. Please check your API key and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Show toast and also log for debugging
      console.log('Showing error toast:', errorMessage);
      toast.error(errorMessage);      
    }
  };

  const handleTransform = async (useLastGenerated: boolean = false) => {
    if (!selectedFile && !useLastGenerated) {
      toast.error('Please upload an image', {
        duration: 10000, // Longer duration for testing
      });
      return;
    }

    // Check if API key exists either in localStorage or in memory
    const localStorageKey = localStorage.getItem('geminiApiKey');
    
    if (!localStorageKey && !apiKey) {
      toast.error('Please enter your API key in settings first');
      setIsSettingsPanelOpen(true);
      return;
    }

    setIsProcessing(true);
    
    try {
      const selectedStyleInfo = STYLE_PRESETS.find(style => style.id === selectedStyle);
      if (!selectedStyleInfo) throw new Error('Style not found');
      
      let sourceImage: File | string | null = selectedFile;
      let sourcePreviewUrl = previewUrl;
      
      // If using the last generated image and it exists
      if (useLastGenerated && transformedImage) {
        // Convert the transformedImage URL to a File object
        try {
          const response = await fetch(transformedImage);
          const blob = await response.blob();
          sourceImage = new File([blob], 'last-generated-image.png', { type: 'image/png' });
          sourcePreviewUrl = transformedImage;
        } catch (error) {
          console.error('Error converting last generated image:', error);
          toast.error('Failed to use the last generated image');
          return;
        }
      }
      
      if (!sourceImage) {
        toast.error('No source image available');
        setIsProcessing(false);
        return;
      }
      
      const transformedImageUrl = await geminiService.transformImage(
        apiKey,
        sourceImage,
        selectedStyleInfo.name,
        selectedStyleInfo.description,
        customInstructions
      );
      
      setTransformedImage(transformedImageUrl);
      
      if (sourcePreviewUrl) {
        setHistory(prev => [
          ...prev, 
          { 
            original: sourcePreviewUrl, 
            transformed: transformedImageUrl 
          }
        ]);
      }
      
      toast.success('Room transformation complete!');
    } catch (error) {
      console.error('Error transforming image:', error);
      console.log("Showing error toast for:", error);
      
      let errorMessage = 'Failed to transform the image, please try again';
      
      if (error instanceof Error) {
        // Check for the specific API key validation error
        if (error.message.includes("[400 ] API key not valid. Please pass a valid API key.")) {
          errorMessage = 'Your API key appears to be invalid. Please check your API key in settings.';
          setIsSettingsPanelOpen(true); // Open settings panel to help user fix the issue
        } else {
          // For other errors, include part of the error message for better debugging
          const errorExcerpt = error.message.length > 100 
            ? error.message.substring(0, 100) + '...' 
            : error.message;
          errorMessage = `Failed to transform: ${errorExcerpt}`;
        }
      }
      
      toast.error(errorMessage);
      
      // For demo/fallback purposes only
      const fallbackImage = STYLE_PRESETS.find(style => style.id === selectedStyle)?.image || null;
      setTransformedImage(fallbackImage);
      if (previewUrl && fallbackImage) {
        setHistory(prev => [...prev, { 
          original: previewUrl, 
          transformed: fallbackImage
        }]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadImage = () => {
    if (transformedImage) {
      const link = document.createElement('a');
      link.href = transformedImage;
      link.download = `room-redesign-${selectedStyle}-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <TransformContext.Provider
      value={{
        apiKey,
        setApiKey,
        selectedFile,
        setSelectedFile,
        previewUrl,
        setPreviewUrl,
        selectedStyle,
        setSelectedStyle,
        customInstructions,
        setCustomInstructions,
        isProcessing,
        setIsProcessing,
        transformedImage,
        setTransformedImage,
        history,
        setHistory,
        handleFileSelect,
        handleDrop,
        handleDragOver,
        handleClear,
        handleTransform,
        handleTestConnection,
        handleDownloadImage,
        saveApiKey,
        isSettingsPanelOpen,
        setIsSettingsPanelOpen,
        persistApiKey,
        setPersistApiKey
      }}
    >
      {children}
    </TransformContext.Provider>
  );
};

export const useTransform = (): TransformContextType => {
  const context = useContext(TransformContext);
  if (context === undefined) {
    throw new Error('useTransform must be used within a TransformProvider');
  }
  return context;
};
