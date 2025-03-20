import { Download, Share2, Facebook, Twitter, Linkedin, Copy, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransform } from '@/context/TransformContext';
import { useState, useRef, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { ShineBorder } from './magicui/shine-border';
import { Card } from './ui/card';

const TransformedImage = () => {
  const { transformedImage, handleDownloadImage } = useTransform();
  
  const [copySuccess, setCopySuccess] = useState(false);
  
  const shareText = "Look how I redesigned my room using AI Home Redesign!";
  const shareUrl = "https://example.com";
  
  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
    toast.success("Sharing to Facebook!");
  };
  
  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    toast.success("Sharing to Twitter!");
  };
  
  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    toast.success("Sharing to LinkedIn!");
  };
  
  const handleInstagramShare = () => {
    // Instagram doesn't support direct URL sharing, so we'll just inform the user
    toast.info("Instagram doesn't support direct sharing. Save the image and upload it to your Instagram.");
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
      setCopySuccess(true);
      toast.success("Share link has been copied to clipboard. Remember to download your redesigned room if you want to share it as well!");
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };
  
  const handleDownloadWithToast = () => {
    handleDownloadImage();
    toast.success("Image downloaded successfully!");
  };
  
  return (
    <Card className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">  
      {transformedImage ? (
        <div className="relative w-full h-full">
          <img
            src={transformedImage}
            alt="Transformed"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button size="sm" onClick={handleDownloadWithToast}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleFacebookShare} className="cursor-pointer">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLinkedInShare} className="cursor-pointer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleInstagramShare} className="cursor-pointer">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">Transform an image to see the result</p>
      )}
      <ShineBorder borderWidth={2} duration={12} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
    </Card>
  );
};

export default TransformedImage;
