// app/api/upload-image/route.ts
import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});


export async function POST(request: Request) {
  const { image } = await request.json(); 

  if (!image) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: 'recipes-website',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return NextResponse.json({ id: result.public_id, imageUrl:result.secure_url }, { status: 200 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Error uploading image to Cloudinary' }, { status: 500 });
  }
}
