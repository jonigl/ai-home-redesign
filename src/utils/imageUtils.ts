export const fileToBase64 = (file: File): Promise<string> => {
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

export const downloadImage = (imageUrl: string, styleName: string): void => {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `room-redesign-${styleName}-${new Date().getTime()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > 10 * 1024 * 1024) {
    return {
      valid: false,
      error: 'File size must be less than 10MB'
    };
  }
  
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPG, PNG, and WebP files are supported'
    };
  }
  
  return { valid: true };
};
