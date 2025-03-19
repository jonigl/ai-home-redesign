import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import SettingsPanel from './SettingsPanel';

const Header = () => {
  return (
    <header className="py-6 flex justify-between items-center">
      <h1 className="text-3xl font-bold">AI Home Redesign with Gemini Flash 2.0 Image Generation</h1>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 stroke-current text-foreground" />
          </Button>
        </SheetTrigger>
        <SettingsPanel />
      </Sheet>
    </header>
  );
};

export default Header;
