export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // If it's already a full URL (from previous Cloudinary setup), return as is
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
  // Normalize path separators - replace backslashes with forward slashes
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  return `${baseUrl}/${normalizedPath}`;
};

export const getLogoUrl = (logoPath) => {
  return getFileUrl(logoPath);
};

export const getVideoUrl = (videoPath) => {
  return getFileUrl(videoPath);
};

export const getAgentProfileUrl = (profilePath) => {
  return getFileUrl(profilePath);
};

export const getPropertyImageUrl = (imagePath) => {
  return getFileUrl(imagePath);
};

export const getPropertyVideoUrl = (videoPath) => {
  return getFileUrl(videoPath);
};

// Add elected bodies URL getter
export const getElectedBodyPhotoUrl = (photoPath) => {
  return getFileUrl(photoPath);
};