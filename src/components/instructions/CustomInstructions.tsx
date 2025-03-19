import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/context/AppContext';

const CustomInstructions = () => {
  const { customInstructions, setCustomInstructions } = useAppContext();

  return (
    <div className="space-y-2">
      <Label htmlFor="instructions">Custom Instructions</Label>
      <Textarea
        id="instructions"
        placeholder="Describe your desired room changes (e.g., 'Add a blue accent wall with floating shelves')"
        maxLength={200}
        value={customInstructions}
        onChange={(e) => setCustomInstructions(e.target.value)}
        className="resize-none h-24"
      />
      <p className="text-sm text-muted-foreground text-right">
        {customInstructions.length}/200
      </p>
    </div>
  );
};

export default CustomInstructions;
