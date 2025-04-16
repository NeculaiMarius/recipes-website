'use client'
import { likeRecipe, unlikeRecipe } from '@/app/stores/RecipeStore';
import { motion } from 'framer-motion';
import React, { useState } from 'react'
import { FaHeart } from 'react-icons/fa';

const FavouriteButtonBig = ({ id_user, id_recipe, isLiked }: { id_user: string; id_recipe: number; isLiked: boolean }) => {
  const [isLikedState,setIsLikedState]=useState(isLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        if (!isLikedState) {
          const success=await likeRecipe(id_recipe,id_user)
          if(success){
            setIsLikedState(true);
          }
        } else {
          const success=await unlikeRecipe(id_recipe,id_user)
          if(success){
            setIsLikedState(false);
          }
        }
      } catch (error) {
        console.error('Error liking recipe:', error);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <motion.button 
      onClick={handleClick} 
      className={`like-button font-bold px-4 py-2 shadow-xl w-[170px] justify-around text-lg  max-md:w-[90px]
                ${isLikedState ? 'bg-red-600 text-gray-100' : 'bg-gray-200 text-gray-700'}`}
      whileTap={{ scale: 0.9 }}>
      {isLoading ? <div className="spinner"></div>:<div className='max-md:hidden'>{isLikedState?"Apreciată":"Apreciază"}</div>}<FaHeart size={25}></FaHeart>
    </motion.button>
  )
}

export default FavouriteButtonBig