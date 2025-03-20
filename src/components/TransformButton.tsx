import { Github, Heart, Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransform } from '@/context/TransformContext';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const TransformButton = () => {
  const { 
    apiKey, 
    isProcessing, 
    handleTransform, 
    setIsSettingsPanelOpen, 
    transformedImage 
  } = useTransform();
  const [isApiKeySaved, setIsApiKeySaved] = useState<boolean>(false);
  const [useLastGenerated, setUseLastGenerated] = useState<boolean>(false);
  
  // Function to check API key status
  const checkApiKeyStatus = () => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    console.log('Checking API key status:', !!savedApiKey);
    setIsApiKeySaved(!!savedApiKey);
  };
  
  useEffect(() => {
    // Check on initial mount
    checkApiKeyStatus();
    
    // Check whenever apiKey changes
    if (apiKey) {
      checkApiKeyStatus();
    }
    
    // Set up event listeners for storage changes
    const handleStorageEvent = () => {
      console.log('Storage event triggered, rechecking API key');
      checkApiKeyStatus();
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    // Custom event listener for direct communication
    const handleCustomEvent = () => {
      console.log('API key saved event triggered');
      checkApiKeyStatus();
    };
    
    window.addEventListener('apiKeySaved', handleCustomEvent);
    
    // Set up an interval to periodically check (as a fallback)
    const intervalId = setInterval(() => {
      checkApiKeyStatus();
    }, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('apiKeySaved', handleCustomEvent);
      clearInterval(intervalId);
    };
  }, [apiKey]);

  // Ensure this function directly opens the settings panel
  const openSettingsPanel = () => {
    console.log('Opening settings panel');
    setIsSettingsPanelOpen(true);
  };

  const handleButtonClick = () => {
    checkApiKeyStatus(); // Check right before handling the click
    
    if (!isApiKeySaved) {
      openSettingsPanel();
    } else {
      handleTransform(useLastGenerated);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4">
      <div className="container mx-auto px-4">
        {!isApiKeySaved && (
          <div className="text-center text-amber-500 mb-2 flex items-center justify-center gap-1 bg-amber-100 rounded-lg w-fit p-3 mx-auto border border-amber-200">
            <Settings className="h-4 w-4" />
            <span>API key needs to be saved first</span>
          </div>
        )}
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button
            className="flex-1"
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
          
          {transformedImage && (
            <div className="flex items-center ml-4">
              <Checkbox 
                id="useLastGenerated" 
                checked={useLastGenerated} 
                onCheckedChange={(checked) => setUseLastGenerated(checked === true)} 
                disabled={!transformedImage}
              />
              <Label htmlFor="useLastGenerated" className="ml-2 text-sm">
                Use last generated
              </Label>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 ml-4 justify-center mt-2">
            Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> by{" "}
            <a 
              href="https://github.com/jonigl" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline hover:text-gray-700 dark:hover:text-gray-300"
            >
              jonigl
            </a>{" "}
            |{" "}
            <a 
              href="https://github.com/jonigl/ai-home-redesign" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
            >
              <Github className="w-4 h-4" /> GitHub Repo
            </a>
          </div>
    </div>
  );
};

export default TransformButton;
