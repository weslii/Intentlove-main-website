import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadMedia, UploadedMedia } from '../lib/supabaseClient';

interface MediaUploadProps {
  onMediaUploaded: (media: UploadedMedia) => void;
  onMediaRemoved: (filename: string) => void;
  onDeleteSavedMedia?: (productId: string, filename: string) => void;
  existingMedia?: string[];
  productId?: string;
  className?: string;
}

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  filename?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onMediaUploaded,
  onMediaRemoved,
  onDeleteSavedMedia,
  existingMedia = [],
  productId,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast.error('Please upload only image or video files.');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedMedia = await uploadMedia(file);
      onMediaUploaded(uploadedMedia);
      setUploadProgress(100);
      
      // Show success message
      const mediaType = uploadedMedia.type === 'image' ? 'Image' : 'Video';
      toast.success(`${mediaType} uploaded successfully!\nFile: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Upload failed!\n${errorMessage}. Please check your internet connection and try again.`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onMediaUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const parseMediaUrl = (mediaString: string): MediaItem => {
    try {
      const parsed = JSON.parse(mediaString);
      return {
        url: parsed.image || parsed.video || '',
        type: parsed.image ? 'image' : 'video',
        filename: parsed.filename // Extract filename if available
      };
    } catch {
      return { url: mediaString, type: 'image' };
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
                 {uploading ? (
           <div className="space-y-2">
             <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
             <p className="text-sm text-gray-600 font-medium">Uploading to Supabase...</p>
             <p className="text-xs text-gray-500">Please wait, this may take a moment</p>
             {uploadProgress > 0 && (
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div 
                   className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                   style={{ width: `${uploadProgress}%` }}
                 />
               </div>
             )}
           </div>
         ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag and drop media files here, or{' '}
              <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                browse
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-gray-500">
              Supports: JPG, PNG, GIF, MP4, MOV (Max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Existing Media Preview */}
      {existingMedia.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Current Media:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {existingMedia.map((mediaString, index) => {
              const mediaItem = parseMediaUrl(mediaString);
              const { url, type } = mediaItem;
              
              return (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {type === 'video' ? (
                      <video
                        src={url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                      >
                        <source src={url} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    )}
                    <div className="hidden w-full h-full bg-gray-100 flex items-center justify-center">
                      {type === 'video' ? (
                        <Video className="w-8 h-8 text-gray-400" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => {
                      // Use stored filename for deletion, or try to extract from URL as fallback
                      const filename = mediaItem.filename || url.split('/').pop()?.split('?')[0];
                      
                      if (filename) {
                        // If we have a productId and onDeleteSavedMedia function, use it
                        if (productId && onDeleteSavedMedia) {
                          onDeleteSavedMedia(productId, filename);
                        } else {
                          // Otherwise use the regular onMediaRemoved for unsaved uploads
                          onMediaRemoved(filename);
                        }
                      } else {
                        toast.error('Could not determine filename for deletion');
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  {/* Media type indicator */}
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-1 py-0.5 rounded text-xs">
                    {type === 'video' ? 'VIDEO' : 'IMAGE'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
