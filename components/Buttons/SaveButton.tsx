'use client';

import { saveRecipe, unSaveRecipe } from '@/app/stores/RecipeStore';
import React, { useEffect, useState } from 'react';
import { FaFlag } from 'react-icons/fa';

const SaveButton = ({ id_user, id_recipe, saved }: { id_user: string; id_recipe: number; saved: boolean }) => {
  const [isSaved, setIsSaved] = useState(saved);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (!isSaved) {
        const success=await saveRecipe(id_recipe,id_user)
        if(success){
          setIsSaved(true);
        }
      } else {
        const success=await unSaveRecipe(id_recipe,id_user)
        if(success){
          setIsSaved(false);
        }
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`like-button w-10 h-10 absolute right-2 top-14  z-10 ${isSaved ? 'bg-blue-700' : 'bg-gray-300'}`}
      onClick={handleClick}
    >
      {isLoading ? <div className="spinner"></div> : <FaFlag size={20} color="white" />}
    </div>
  );
};

export default SaveButton;
