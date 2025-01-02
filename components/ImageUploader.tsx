import React, { useState, ChangeEvent } from 'react';
import { Input } from './ui/input';
import Image from 'next/image';

export default function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setSelectedImage(reader.result as string||null); 
      };
    }
  };

  return (
    <div>
      <label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden" 
        />
        <span className="cursor-pointer bg-gray-200 px-4 py-2 rounded">
          Alege o imagine
        </span>
      </label>

      {selectedImage && (
        <div className="preview mt-4">
          <Image
            width={100}
            height={100}
            src={selectedImage}
            alt="Preview Imagine"
            className="rounded-md max-w-xs max-h-64"
          />
        </div>
      )}
    </div>
  );
}
