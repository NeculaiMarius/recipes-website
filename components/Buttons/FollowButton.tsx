'use client'
import React, { useState } from 'react'
import { RiUserFollowLine } from "react-icons/ri";
import { followUser, unfollowUser } from '@/app/stores/UserStore'


const FollowButton = ({ id_user, id_followed_user, followed }: { id_user: string; id_followed_user : string; followed: boolean }) => {
  const [isFollowed, setIsFollowed] = useState(followed);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        if (!isFollowed) {
          const success=await followUser(id_user,id_followed_user)
          if(success){
            setIsFollowed(true);
          }
        } else {
          const success=await unfollowUser(id_user,id_followed_user)
          if(success){
            setIsFollowed(false);
          }
        }
      } catch (error) {
        console.error('Error following user:', error);
      } finally {
        setIsLoading(false);
      }
    };
  return (
    <div
          className={`like-button w-full h-full right-2 top-2 z-10 ${isFollowed ? 'bg-emerald-700' : 'bg-gray-300'}`}
          onClick={handleClick}
        >
          {isLoading ? 
          <div className="spinner"></div> : 
          <div>{isFollowed?<RiUserFollowLine className='text-2xl text-white'/>:"Urmărește"}</div>}
        </div>
  )
}

export default FollowButton