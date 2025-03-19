import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransform } from '@/context/TransformContext';
import SettingsPanel from './SettingsPanel';

const Header = () => {
  const { setIsSettingsPanelOpen } = useTransform();

  const handleOpenSettings = () => {
    setIsSettingsPanelOpen(true);
  };

  return (
    <header className="py-6 flex justify-between items-center">
      <h1 className="text-3xl font-bold">AI Home Redesign with Gemini Flash 2.0 Image Generation</h1>
      <Button variant="ghost" size="icon" onClick={handleOpenSettings}>
        <Settings className="h-5 w-5 stroke-current text-foreground" />
      </Button>
      <SettingsPanel />
    </header>
  );
};

export default Header;
