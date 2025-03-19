import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useTransform } from '@/context/TransformContext';

const SettingsPanel = () => {
  const { apiKey, setApiKey, handleTestConnection, saveApiKey } = useTransform();

  return (
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
          <Button variant="outline" onClick={saveApiKey} className="flex-1">Save</Button>
        </div>
      </div>
    </SheetContent>
  );
};

export default SettingsPanel;
