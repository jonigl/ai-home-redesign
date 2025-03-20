/**
 * Simple encryption using Caesar cipher with base64 encoding
 * Note: This is a simple obfuscation, not secure encryption
 * For a production app, use a proper encryption library
 */
export const encryptApiKey = (apiKey: string): string => {
  if (!apiKey) return '';
  
  // Simple shift cipher with a fixed shift
  const shift = 7; // Simple shift value
  
  // Apply shift to each character code
  const encrypted = apiKey.split('').map(char => {
    const code = char.charCodeAt(0);
    return String.fromCharCode(code + shift);
  }).join('');
  
  // Convert to base64 for better storage
  return btoa(encrypted);
};

/**
 * Decrypt the encrypted API key
 */
export const decryptApiKey = (encryptedKey: string): string => {
  if (!encryptedKey) return '';
  
  try {
    // Decode from base64
    const decoded = atob(encryptedKey);
    
    // Reverse the shift
    const shift = 7;
    return decoded.split('').map(char => {
      const code = char.charCodeAt(0);
      return String.fromCharCode(code - shift);
    }).join('');
  } catch (error) {
    console.error('Failed to decrypt API key:', error);
    return '';
  }
};
