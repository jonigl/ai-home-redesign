import { Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { downloadImage } from '@/utils/imageUtils';

const TransformedImage = () => {
  const { transformedImage, selectedStyle } = useAppContext();

  const handleDownloadImage = () => {
    if (transformedImage) {
      downloadImage(transformedImage, selectedStyle);
    }
  };

  return (
    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
      {transformedImage ? (
        <div className="relative w-full h-full">
          <img
            src={transformedImage}
            alt="Transformed"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button size="sm" onClick={handleDownloadImage}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">Transform an image to see the result</p>
      )}
    </div>
  );
};

export default TransformedImage;
