import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useTransform } from '@/context/TransformContext';
import { Info } from 'lucide-react';

const SettingsPanel = () => {
  const { 
    apiKey, 
    setApiKey, 
    handleTestConnection, 
    saveApiKey, 
    isSettingsPanelOpen, 
    setIsSettingsPanelOpen,
    persistApiKey,
    setPersistApiKey
  } = useTransform();

  const handleSaveClick = () => {
    saveApiKey();
    
    // Dispatch a custom event to notify other components that the API key was saved
    window.dispatchEvent(new Event('storage'));
    
    // Close the panel after saving
    setTimeout(() => {
      setIsSettingsPanelOpen(false);
    }, 1000);
  };

  const handlePersistToggle = (checked: boolean) => {
    setPersistApiKey(checked);
  };

  return (
    <Sheet open={isSettingsPanelOpen} onOpenChange={setIsSettingsPanelOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configuration</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="api-key">Google Gemini API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
            <a 
              href="https://ai.google.dev/gemini-api/docs/api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-700 inline-block mt-1"
            >
              How to get a Google Gemini API key
            </a>
          </div>

          <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="persist-api-key" 
                checked={persistApiKey} 
                onCheckedChange={handlePersistToggle} 
              />
              <Label htmlFor="persist-api-key" className="cursor-pointer">
                Remember API key
              </Label>
              <div className="group relative">
                <Info className="h-4 w-4 text-muted-foreground" />
                <div className="absolute right-2 bottom-full mb-2 hidden w-64 rounded-md bg-popover p-3 text-xs text-popover-foreground shadow-2xl border group-hover:block z-50">
                  When enabled, your API key will be saved in browser local storage and persist 
                  between sessions. If disabled, the key will only be available for the 
                  current session and will be lost when you reload or close the page. 
                  Your API key is stored with basic encryption when saved.
                </div>
              </div>
            </div>
                        
          <div className="flex space-x-2">
            <Button variant="default" onClick={handleSaveClick} className="flex-1">
              {persistApiKey ? 'Save' : 'Use for this session'}
            </Button>
            <Button variant="outline" onClick={handleTestConnection} className="flex-1">Test Connection</Button>
            
          </div>
          {/* Add notice about non-persistent API key */}
          {apiKey && !persistApiKey && (
              <div className="text-blue-500 flex items-center gap-1 bg-blue-50 rounded-lg p-2 border border-blue-100 mt-2 text-sm">
                <Info className="h-4 w-4 flex-shrink-0" />
                <span>API key will be lost when page is refreshed</span>
              </div>
            )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;
