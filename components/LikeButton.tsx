'use client';

import React, { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';

const LikeButton = ({ id_user, id_recipe, liked }: { id_user: string; id_recipe: string; liked: boolean }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [isLoading, setIsLoading] = useState(false);

  const likeRecipe = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (!isLiked) {
        const response = await fetch('/api/like-recipe/like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_recipe: id_recipe,
            id_user: id_user,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setIsLiked(true);
      } else {
        const response = await fetch('/api/like-recipe/unlike', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_recipe: id_recipe,
            id_user: id_user,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-md cursor-pointer transition-colors duration-300 absolute right-2 top-2 z-10 ${isLiked ? 'bg-red-600' : 'bg-gray-300'}`}
      onClick={likeRecipe}
    >
      {isLoading ? <div className="spinner"></div> : <FaHeart size={20} color="white" />}
    </div>
  );
};

export default LikeButton;
