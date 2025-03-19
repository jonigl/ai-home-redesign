import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAppContext } from '@/context/AppContext';
import { testApiConnection } from '@/utils/apiUtils';

const SettingsPanel = () => {
  const { toast } = useToast();
  const { apiKey, setApiKey, saveApiKey } = useAppContext();

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
      const success = await testApiConnection(apiKey);
      if (success) {
        toast({
          title: 'Success',
          description: 'API connection successful! Your API key is valid.',
        });
        saveApiKey();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Invalid API key or insufficient permissions',
        variant: 'destructive',
      });
    }
  };

  const handleSaveApiKey = () => {
    saveApiKey();
    toast({
      title: 'Success',
      description: apiKey ? 'API key saved' : 'API key cleared',
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
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
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleTestConnection} className="flex-1">Test Connection</Button>
            <Button 
              variant="outline" 
              onClick={handleSaveApiKey}
              className="flex-1"
            >
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;
