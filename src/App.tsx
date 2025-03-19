import { useState, useEffect } from 'react';
import { Upload, Share2, Download, Loader2, Settings, Trash } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const STYLE_PRESETS = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines, neutral colors, decluttered spaces',
    image: 'https://plus.unsplash.com/premium_photo-1661888751535-d904c82257a3?q=80&w=3066&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'modern',
    name: 'Modern Contemporary',
    description: 'Sleek, updated fixtures, current trends',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    description: 'Light woods, whites, functional design',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c',
  },
  {
    id: 'industrial',
    name: 'Industrial Chic',
    description: 'Exposed elements, raw materials',
    image: 'https://plus.unsplash.com/premium_photo-1676320102845-4fa58706484e?q=80&w=3045&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'traditional',
    name: 'Cozy Traditional',
    description: 'Warm colors, classic elements',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Eclectic, colorful, artistic',
    image: 'https://images.unsplash.com/photo-1583845112203-29329902332e?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

function App() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('minimalist');
  const [customInstructions, setCustomInstructions] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ original: string; transformed: string }>>([]);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size must be less than 10MB',
          variant: 'destructive',
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({
          title: 'Error',
          description: 'Only JPG, PNG, and WebP files are supported',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size must be less than 10MB',
          variant: 'destructive',
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({
          title: 'Error',
          description: 'Only JPG, PNG, and WebP files are supported',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTransformedImage(null);
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter your API key',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Initialize the Google Generative AI client with the API key
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Try to get a model to verify the API key works
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Test connection");
      
      if (result) {
        toast({
          title: 'Success',
          description: 'API connection successful! Your API key is valid.',
        });
        // Save API key to localStorage
        localStorage.setItem('geminiApiKey', apiKey);
      }
    } catch (error) {
      console.error('API key validation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Invalid API key or insufficient permissions',
        variant: 'destructive',
      });
    }
  };

  // Function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

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
      // Initialize the Google Generative AI client with the API key
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Get the image generation model with proper configuration
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ['Text', 'Image'],
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        }
      });
      
      // Convert the image file to base64
      const base64Image = await fileToBase64(selectedFile);
      
      // Construct prompt based on selected style and custom instructions
      const selectedStyleInfo = STYLE_PRESETS.find(style => style.id === selectedStyle);
      let prompt = `Transform this room photo into a ${selectedStyleInfo?.name} style (${selectedStyleInfo?.description}). Generate a new image.`;
      
      if (customInstructions) {
        prompt += ` ${customInstructions}`;
      }
      
      // Prepare parts for the prompt
      const parts = [
        {
          inlineData: {
            mimeType: selectedFile.type,
            data: base64Image.split(',')[1]
          }
        },
        { text: prompt }
      ];
      
      // Generate content
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
      });
      
      const response = result.response;
      console.log("API Response:", response); 
      
      // Check for images in the response
      const responseParts = response.candidates?.[0]?.content?.parts;
      if (responseParts && responseParts.length > 0) {
        // Look for the image part in the response
        for (const part of responseParts) {
          if (part.inlineData) {
            const imageData = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            const transformedImageData = `data:${mimeType};base64,${imageData}`;
            
            setTransformedImage(transformedImageData);
            
            if (previewUrl) {
              setHistory(prev => [
                ...prev, 
                { 
                  original: previewUrl, 
                  transformed: transformedImageData 
                }
              ]);
            }
            
            toast({
              title: 'Success',
              description: 'Room transformation complete!',
            });
            
            // Exit after finding the first image
            return;
          }
        }
        
        // If we get here, we found no image in the response
        throw new Error('No image was generated in the response');
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error transforming image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to transform the image',
        variant: 'destructive',
      });
      
      // For demo/fallback purposes only
      setTransformedImage(STYLE_PRESETS.find(style => style.id === selectedStyle)?.image || null);
      if (previewUrl) {
        setHistory(prev => [...prev, { 
          original: previewUrl, 
          transformed: STYLE_PRESETS.find(style => style.id === selectedStyle)?.image || ''
        }]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadImage = () => {
    if (transformedImage) {
      const link = document.createElement('a');
      link.href = transformedImage;
      link.download = `room-redesign-${selectedStyle}-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <header className="py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">AI Home Redesign with Gemini Flash 2.0 Image Generation</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
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
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (apiKey) {
                        localStorage.setItem('geminiApiKey', apiKey);
                        toast({
                          title: 'Success',
                          description: 'API key saved',
                        });
                      } else {
                        localStorage.removeItem('geminiApiKey');
                        toast({
                          title: 'Info',
                          description: 'API key cleared',
                        });
                      }
                    }} 
                    className="flex-1"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="space-y-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  className={`group relative aspect-square rounded-lg overflow-hidden ${
                    selectedStyle === style.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-white font-medium text-sm">{style.name}</h3>
                    <p className="text-white/80 text-xs hidden group-hover:block">
                      {style.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

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
          </div>

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
        </main>
      </div>
    </div>
  );
}

export default App;
