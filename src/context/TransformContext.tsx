import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { STYLE_PRESETS } from '@/constants/stylePresets';
import { useToast } from '@/hooks/use-toast';
import * as geminiService from '@/services/geminiService';

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
  handleTransform: () => Promise<void>;
  handleTestConnection: () => Promise<void>;
  handleDownloadImage: () => void;
  saveApiKey: () => void;
};

const TransformContext = createContext<TransformContextType | undefined>(undefined);

export const TransformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('minimalist');
  const [customInstructions, setCustomInstructions] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ original: string; transformed: string }>>([]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size must be less than 10MB',
          variant: 'destructive',
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({
          title: 'Error',
          description: 'Only JPG, PNG, and WebP files are supported',
          variant: 'destructive',
        });
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
        toast({
          title: 'Error',
          description: 'File size must be less than 10MB',
          variant: 'destructive',
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({
          title: 'Error',
          description: 'Only JPG, PNG, and WebP files are supported',
          variant: 'destructive',
        });
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
      toast({
        title: 'Error',
        description: 'Please enter your API key',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await geminiService.testConnection(apiKey);
      toast({
        title: 'Success',
        description: 'API connection successful! Your API key is valid.',
      });
      localStorage.setItem('geminiApiKey', apiKey);
    } catch (error) {
      console.error('API key validation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Invalid API key or insufficient permissions',
        variant: 'destructive',
      });
    }
  };

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('geminiApiKey', apiKey);
      toast({
        title: 'Success',
        description: 'API key saved',
      });
    } else {
      localStorage.removeItem('geminiApiKey');
      toast({
        title: 'Info',
        description: 'API key cleared',
      });
    }
  };

  const handleTransform = async () => {
    if (!selectedFile || !apiKey) {
      toast({
        title: 'Error',
        description: 'Please upload an image and enter your API key',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const selectedStyleInfo = STYLE_PRESETS.find(style => style.id === selectedStyle);
      if (!selectedStyleInfo) throw new Error('Style not found');
      
      const transformedImageUrl = await geminiService.transformImage(
        apiKey,
        selectedFile,
        selectedStyleInfo.name,
        selectedStyleInfo.description,
        customInstructions
      );
      
      setTransformedImage(transformedImageUrl);
      
      if (previewUrl) {
        setHistory(prev => [
          ...prev, 
          { 
            original: previewUrl, 
            transformed: transformedImageUrl 
          }
        ]);
      }
      
      toast({
        title: 'Success',
        description: 'Room transformation complete!',
      });
    } catch (error) {
      console.error('Error transforming image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to transform the image',
        variant: 'destructive',
      });
      
      // For demo/fallback purposes only
      setTransformedImage(STYLE_PRESETS.find(style => style.id === selectedStyle)?.image || null);
      if (previewUrl) {
        setHistory(prev => [...prev, { 
          original: previewUrl, 
          transformed: STYLE_PRESETS.find(style => style.id === selectedStyle)?.image || ''
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
        saveApiKey
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
