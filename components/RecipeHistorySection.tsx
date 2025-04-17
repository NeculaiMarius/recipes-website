"use client"
import { RecipeDisplay, RecipePage } from '@/interfaces/recipe';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import RecipeDisplayCard from './RecipeDisplayCard';
import { FaClock } from 'react-icons/fa6';
import { Card, CardContent } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './ui/carousel';

const RecipeHistorySection = ({userId}:{userId:string}) => {
  const [istoric, setIstoric] = useState<RecipePage[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("istoricRetete");
    if (stored) {
      setIstoric(JSON.parse(stored));
    }
  }, []);

  if (istoric.length === 0) {
    return <p className="text-gray-500">Nu ai vizitat nicio rețetă recent.</p>;
  }

  return (
    <>
    <h2 className="text-xl font-semibold mb-4 flex justify-center gap-2 items-center">
      <FaClock className='text-emerald-700 size-8' />
      Rețete vizitate recent
    </h2>

    <Carousel
      opts={{
        align: "start",
        dragFree:true
      }}
      className="w-full lg:px-20 cursor-grab"
    >
      <CarouselContent className='max-sm:pl-5'>
        {istoric.map((recipe) => (
          <CarouselItem key={recipe.id} className="md:mx-4  flex-[0_0_auto] pl-0 min-w-[170px] max-w-[300px] ">
            <RecipeDisplayCard recipe={recipe as unknown as RecipeDisplay} id_user={userId} key={recipe.id} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    </>
  );
}

export default RecipeHistorySection