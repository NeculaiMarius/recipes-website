"use client"
import { getLikesUsers } from '@/app/stores/UserStore';
import { User } from '@/interfaces/users';
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import UserCard from '../UserCard';
import { FaHeart } from 'react-icons/fa';
import { formatCount } from '@/lib/utils';

const LikesList = ({recipeId,noLikes,userId}:{recipeId:string,userId:string,noLikes:number}) => {
  const [users,setUsers]=useState<User[]>([]);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getLikesUsers(recipeId);
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, [recipeId]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <span className='flex gap-2 items-center hover:bg-white rounded-md px-2 py-1 cursor-pointer'>
                <FaHeart size={20} className='text-red-600'/>
                {formatCount(noLikes)}
              </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Apreciat de {formatCount(noLikes)} utilizatori</DialogTitle>
                <DialogDescription>Persoanele care au apreciat</DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto pr-1">
                <div className="flex flex-col gap-2 h-[400px] overflow-auto">
                  {users.map((user) => (
                    <UserCard account={user} userId={userId} key={user.id}></UserCard>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
  )
}

export default LikesList