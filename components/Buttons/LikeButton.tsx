'use client';

import { likeRecipe, unlikeRecipe } from '@/app/stores/RecipeStore';
import React, { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';

const LikeButton = ({ id_user, id_recipe, liked }: { id_user: string; id_recipe: string; liked: boolean }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (!isLiked) {
        let success=await likeRecipe(id_recipe,id_user)
        if(success){
          setIsLiked(true);
        }
      } else {
        let success=await unlikeRecipe(id_recipe,id_user)
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
