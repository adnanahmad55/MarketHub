"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <CldUploadWidget 
        // 👇 Cloudinary Dashboard se preset name yahan dalo
        uploadPreset="ml_default" 
        onSuccess={(result: any) => {
          onChange(result.info.secure_url);
        }}
      >
        {({ open }) => {
          return (
            <div 
              onClick={() => open()}
              className="relative cursor-pointer hover:bg-gray-100 transition border-dashed border-2 p-16 border-gray-300 flex flex-col justify-center items-center gap-2 text-gray-500 bg-gray-50 rounded-2xl w-full"
            >
              <span className="text-4xl">📸</span>
              <p className="font-bold underline">Click to Upload Image</p>
              <p className="text-xs">Supports JPG, PNG, WEBP</p>
              
              {value && (
                <div className="absolute inset-0 w-full h-full p-2 bg-white rounded-2xl">
                  <Image
                    fill
                    style={{ objectFit: 'contain' }}
                    src={value}
                    alt="Product Preview"
                    className="rounded-xl"
                  />
                </div>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}