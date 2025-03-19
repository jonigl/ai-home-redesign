import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { transformImage } from '@/utils/apiUtils';
import { STYLE_PRESETS } from '@/data/stylePresets';

const TransformButton = () => {
  const { toast } = useToast();
  const { 
    selectedFile, 
    apiKey, 
    isProcessing, 
    setIsProcessing, 
    selectedStyle,
    customInstructions,
    setTransformedImage,
    previewUrl,
    setHistory
  } = useAppContext();

  const handleTransform = async () => {
    if (!selectedFile || !apiKey) {
      toast({
        title: 'Error',
        description: 'Please upload an image and enter your API key',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const imageUrl = await transformImage(
        apiKey,
        selectedFile,
        selectedStyle,
        STYLE_PRESETS,
        customInstructions
      );
      
      setTransformedImage(imageUrl);
      
      if (previewUrl) {
        setHistory(prev => [
          ...prev, 
          { 
            original: previewUrl, 
            transformed: imageUrl 
          }
        ]);
      }
      
      toast({
        title: 'Success',
        description: 'Room transformation complete!',
      });
    } catch (error) {
      console.error('Error transforming image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to transform the image',
        variant: 'destructive',
      });
      
      // For demo/fallback purposes only
      const fallbackImage = STYLE_PRESETS.find(style => style.id === selectedStyle)?.image || null;
      setTransformedImage(fallbackImage);
      if (previewUrl && fallbackImage) {
        setHistory(prev => [...prev, { 
          original: previewUrl, 
          transformed: fallbackImage
        }]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

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
