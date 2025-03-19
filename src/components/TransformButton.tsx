import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransform } from '@/context/TransformContext';

const TransformButton = () => {
  const { selectedFile, apiKey, isProcessing, handleTransform } = useTransform();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4">
      <div className="container mx-auto px-4">
        <Button
          className="w-full max-w-lg mx-auto"
          size="lg"
          onClick={handleTransform}
          disabled={!selectedFile || !apiKey || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Transform Room'
          )}
        </Button>
      </div>
    </div>
  );
};

export default TransformButton;
