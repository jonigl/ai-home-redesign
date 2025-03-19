import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HistoryItem } from '@/types';

interface AppContextProps {
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
  setIsProcessing: (isProcessing: boolean) => void;
  transformedImage: string | null;
  setTransformedImage: (url: string | null) => void;
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  saveApiKey: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('minimalist');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('geminiApiKey', apiKey);
    } else {
      localStorage.removeItem('geminiApiKey');
    }
  };

  return (
    <AppContext.Provider
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
        saveApiKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
