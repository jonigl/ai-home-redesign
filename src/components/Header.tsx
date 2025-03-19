import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransform } from '@/context/TransformContext';
import SettingsPanel from './SettingsPanel';
import { AuroraText } from './magicui/aurora-text';

const Header = () => {
  const { setIsSettingsPanelOpen } = useTransform();

  const handleOpenSettings = () => {
    setIsSettingsPanelOpen(true);
  };

  return (
    <header className="py-6 flex justify-between items-center">
      <h1 className="text-3xl font-extrabold"><AuroraText>AI</AuroraText> Home Redesign</h1>
      <h2 className="text-lg text-muted-foreground">Powered by Gemini Flash 2.0 (Image Generation) Experimental</h2>
      <Button variant="ghost" size="icon" onClick={handleOpenSettings}>
        <Settings className="h-5 w-5 stroke-current text-foreground" />
      </Button>
      <SettingsPanel />
    </header>
  );
};

export default Header;
