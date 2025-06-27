'use client';

import { likeRecipe, unlikeRecipe } from '@/app/stores/RecipeStore';
import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

const LikeButton = ({ id_recipe, liked }: { id_recipe: number; liked: boolean }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (!isLiked) {
        const success=await likeRecipe(id_recipe)
        if(success){
          setIsLiked(true);
        }
      } else {
        const success=await unlikeRecipe(id_recipe)
        if(success){
          setIsLiked(false);
        }
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`like-button w-10 h-10 absolute right-2 top-2 z-10 ${isLiked ? 'bg-red-600' : 'bg-gray-300'}`}
      onClick={handleClick}
    >
      {isLoading ? <div className="spinner"></div> : <FaHeart size={20} color="white" />}
    </div>
  );
};

export default LikeButton;

