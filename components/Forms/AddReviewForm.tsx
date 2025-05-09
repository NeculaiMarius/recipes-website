'use client'
import React, { useState } from 'react'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { addReview, deleteReview } from '@/app/stores/ReviewStore'
import { FaStar } from 'react-icons/fa'
import { ReviewRecipePage } from '@/interfaces/review'
import { MdDeleteForever } from 'react-icons/md'

const AddReviewForm = ({id_recipe,currentReview}:{id_recipe:string,currentReview:ReviewRecipePage}) => {
  const [content,setContent]=useState(currentReview?.continut);
  const [rating,setRating]=useState(currentReview?.rating);
  const [error,setError]=useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const [isOpen,setIsOpen]=useState(false)

  const handleClick=async ()=>{
    setIsLoading(true)  
    if(content.length<5){
      setError(true);
      return;
    }
    setError(false);

    try {
      const response=await addReview(id_recipe,content,rating)
      if(response){
        console.log('Review adaugat');
      }
    } catch (error) {
      console.error('Error adding review: ', error);
    }
    finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }

  const handleDelete=async ()=>{
    try {
      const response= await deleteReview(currentReview.id)
      if(response){
        location.reload();
      }
    } catch (error) {
      console.error("Error deleteng review",error);
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        <div className='mt-8 border-4 border-yellow-600 text-yellow-700 font-bold text-xl w-fit px-4 py-2 rounded-md mx-auto shadow-md cursor-pointer'>
          {currentReview?"Modifică review-ul tău":"Lasă un review"}
        </div>
      </DrawerTrigger>
      <DrawerContent className='lg:w-[70%] px-12 mx-auto max-md:px-2 '>
        <DrawerHeader className='flex justify-between h-fit'>
          <DrawerTitle className='mb-8'>Scrie un review pentru această rețetă</DrawerTitle>
          {
            currentReview &&(
<div className=' bg-red-700 h-fit p-2 rounded-md hover:bg-red-800 cursor-pointer'
                onClick={handleDelete}>
            <MdDeleteForever size={25} className='text-white' />
          </div>
            )
          }
          
        </DrawerHeader>
        <div className='px-4 flex flex-col items-center'>
          <span className='text-red-700 my-2'>
            {error?"Trebuie completat acest camp cu minim 5 caractere!":""}
          </span>
          <Textarea maxLength={1000} placeholder='Ce părere ai despre această rețetă?' onChange={(e)=>{setContent(e.target.value)}}>{content}</Textarea>
          <div className="flex gap-1 text-gray-400 mt-4 mb-12">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => setRating(star)}
                className={`w-12 h-12 cursor-pointer transition-colors duration-200 ${
                  star <= rating ? "text-yellow-500" : "text-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
        <DrawerFooter>
          <Button className='w-[50%] mx-auto font-semibold bg-emerald-800 text-md' onClick={handleClick}>
            {isLoading?<div className="spinner"></div>:"Postează review"}
          </Button>
          <Button className='w-[50%] mx-auto bg-gray-200 text-emerald-700 font-semibold text-md' onClick={()=>setIsOpen(false)}>
            Anulare
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default AddReviewForm