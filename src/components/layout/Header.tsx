import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SettingsPanel from '@/components/settings/SettingsPanel';

const Header = () => {
  return (
    <header className="py-6 flex justify-between items-center">
      <h1 className="text-3xl font-bold">AI Home Redesign with Gemini Flash 2.0 Image Generation</h1>
      <SettingsPanel />
    </header>
  );
};

export default Header;
