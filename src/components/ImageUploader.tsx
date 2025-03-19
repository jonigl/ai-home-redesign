import { Upload, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransform } from '@/context/TransformContext';

const ImageUploader = () => {
  const { previewUrl, handleDrop, handleDragOver, handleFileSelect, handleClear } = useTransform();

  return (
    <div
      className="aspect-video border-2 border-dashed rounded-lg p-4 flex items-center justify-center hover:border-primary/50 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {previewUrl ? (
        <div className="relative w-full h-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <Button 
            variant="outline" 
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClear}
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <Label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Upload Photo
          </Label>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileSelect}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Drag & drop or click to upload (JPG, PNG, WEBP, max 1MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
