"use client"
import { RecipeDisplay, RecipePage } from '@/interfaces/recipe';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import RecipeDisplayCard from './RecipeDisplayCard';
import { FaClock } from 'react-icons/fa6';

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
      <div className="justify-center flex flex-wrap w-full max-sm:justify-evenly">
        {istoric.map((recipe) => (
          <RecipeDisplayCard recipe={recipe as unknown as RecipeDisplay} id_user={userId} key={recipe.id}></RecipeDisplayCard>
        ))}
      </div>
    </>
  );
}

export default RecipeHistorySection