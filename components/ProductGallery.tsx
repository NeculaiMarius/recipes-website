"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductImage {
  url: string
  alt: string
}

interface ProductGalleryProps {
  product: {
    product_name: string
    image_url: string 
    image_front_url: string 
    image_ingredients_url: string 
    image_nutrition_url: string 
    image_packaging_url: string 
  }
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const productImages: ProductImage[] = [
    ...(product.image_url ? [{ url: product.image_url, alt: product.product_name || "Product image" }] : []),
    ...(product.image_front_url ? [{ url: product.image_front_url, alt: "Front" }] : []),
    ...(product.image_ingredients_url ? [{ url: product.image_ingredients_url, alt: "Ingredients" }] : []),
    ...(product.image_nutrition_url ? [{ url: product.image_nutrition_url, alt: "Nutrition" }] : []),
    ...(product.image_packaging_url ? [{ url: product.image_packaging_url, alt: "Packaging" }] : []),
  ]

  const [mainImage, setMainImage] = useState<ProductImage | null>(productImages.length > 0 ? productImages[0] : null)

  return (
    <div className="flex flex-col items-center px-10">
      <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden border shadow-sm bg-gray-100">
        {mainImage ? (
          <Image
            src={mainImage.url || "/placeholder.svg"}
            alt={mainImage.alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4 w-full max-w-md">
        {product.image_url && (
          <div
            className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer ${
              mainImage?.url === product.image_url ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setMainImage({ url: product.image_url, alt: product.product_name || "Product image" })}
          >
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.product_name || "Product image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 10vw"
            />
          </div>
        )}
        {product.image_front_url && (
          <div
            className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer ${
              mainImage?.url === product.image_front_url ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setMainImage({ url: product.image_front_url, alt: "Front" })}
          >
            <Image
              src={product.image_front_url || "/placeholder.svg"}
              alt="Front"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 10vw"
            />
          </div>
        )}
        {product.image_ingredients_url && (
          <div
            className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer ${
              mainImage?.url === product.image_ingredients_url ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setMainImage({ url: product.image_ingredients_url, alt: "Ingredients" })}
          >
            <Image
              src={product.image_ingredients_url || "/placeholder.svg"}
              alt="Ingredients"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 10vw"
            />
          </div>
        )}
        {product.image_nutrition_url && (
          <div
            className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer ${
              mainImage?.url === product.image_nutrition_url ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setMainImage({ url: product.image_nutrition_url, alt: "Nutrition" })}
          >
            <Image
              src={product.image_nutrition_url || "/placeholder.svg"}
              alt="Nutrition"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 10vw"
            />
          </div>
        )}
        {product.image_packaging_url && (
          <div
            className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer ${
              mainImage?.url === product.image_packaging_url ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setMainImage({ url: product.image_packaging_url, alt: "Packaging" })}
          >
            <Image
              src={product.image_packaging_url || "/placeholder.svg"}
              alt="Packaging"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 10vw"
            />
          </div>
        )}
      </div>
    </div>
  )
}

