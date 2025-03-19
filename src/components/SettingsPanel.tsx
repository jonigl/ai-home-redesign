import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useTransform } from '@/context/TransformContext';
import { useEffect } from 'react';

const SettingsPanel = () => {
  const { apiKey, setApiKey, handleTestConnection, saveApiKey, isSettingsPanelOpen, setIsSettingsPanelOpen } = useTransform();

  const handleSaveClick = () => {
    saveApiKey();
    
    // Dispatch a custom event to notify other components that the API key was saved
    window.dispatchEvent(new Event('storage'));
    
    // Close the panel after saving
    setTimeout(() => {
      setIsSettingsPanelOpen(false);
    }, 1000);
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
          <div className="flex space-x-2">
            <Button onClick={handleTestConnection} className="flex-1">Test Connection</Button>
            <Button variant="outline" onClick={handleSaveClick} className="flex-1">Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;
