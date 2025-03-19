import { Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransform } from '@/context/TransformContext';
import { useState, useEffect } from 'react';

const TransformButton = () => {
  const { selectedFile, apiKey, isProcessing, handleTransform, setIsSettingsPanelOpen } = useTransform();
  const [isApiKeySaved, setIsApiKeySaved] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if API key is saved in localStorage
    const checkApiKey = () => {
      const savedApiKey = localStorage.getItem('geminiApiKey');
      setIsApiKeySaved(!!savedApiKey);
    };
    
    // Initial check
    checkApiKey();
    
    // Set up event listener for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'geminiApiKey') {
        checkApiKey();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also re-check when apiKey state changes
    checkApiKey();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [apiKey]);
  
  // Add a manual check function that can be called after saving the API key
  const checkApiKeyStatus = () => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    setIsApiKeySaved(!!savedApiKey);
  };

  // Ensure this function directly opens the settings panel
  const openSettingsPanel = () => {
    console.log('Opening settings panel');
    setIsSettingsPanelOpen(true);
  };

  const handleButtonClick = () => {
    if (!isApiKeySaved) {
      openSettingsPanel();
    } else {
      handleTransform();
    }
    // After any action, check the API key status again
    checkApiKeyStatus();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4">
      <div className="container mx-auto px-4">
        {!isApiKeySaved && (
          <div className="text-center text-amber-500 mb-2 flex items-center justify-center gap-1">
            <Settings className="h-4 w-4" />
            <span>API key needs to be saved first</span>
          </div>
        )}
        <Button
          className="w-full max-w-lg mx-auto"
          size="lg"
          onClick={handleButtonClick}
          disabled={isProcessing}
          variant={!isApiKeySaved ? "outline" : "default"}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : !isApiKeySaved ? (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Set up API Key
            </>
          ) : (
            'Transform Room'
          )}
        </Button>
      </div>
    </div>
  );
};

export default TransformButton;
