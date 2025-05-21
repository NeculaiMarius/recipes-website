"use client"

import Link from "next/link"
import { ThumbsUp, Flag, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ReviewRecipePage } from "@/interfaces/review"
import Rating from "./Rating"
import { likeReview, unlikeReview } from "@/app/stores/ReviewStore"
import { ReportDialog } from "./Forms/ReportDialog"
import DeleteReviewAlert from "./AlertDialogs/DeleteReviewAlert"


export default function ReviewCard({ review, isAdmin }:{review:ReviewRecipePage,isAdmin:boolean}) {
  const [likeCount, setLikeCount] = useState(Number(review.numar_aprecieri))
  const [isLiked, setIsLiked] = useState(review.liked)
  const [isLoading, setIsLoading] = useState(false);
  

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!isLiked) {
        const success=await likeReview(review.id)
        if(success){
          setIsLiked(true);
          setLikeCount((prev) => prev + 1)
        }
      } else {
        const success=await unlikeReview(review.id)
        if(success){
          setIsLiked(false);
          setLikeCount((prev) => prev - 1)
        }
        
      }
    } catch (error) {
      console.error('Error liking review:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleReport = () => {

  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 shadow-md rounded-lg" key={review.id}>
      <div className="flex items-center gap-3">
        <Link href={`/Account/${review.id_utilizator}`}>
          <Avatar className="h-12 w-12 border">
            <AvatarFallback>{(review.nume[0] + review.prenume[0]).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="w-full">
          <div className="flex justify-between w-full">
            <Link href={`/Account/${review.id_utilizator}`}>
              <span className="block font-semibold text-gray-900 hover:text-emerald-700 hover:underline">
                {review.nume + " " + review.prenume}
              </span>
            </Link>
            {
              isAdmin&&
              <span className="text-sm text-blue-700">Atitudine {review.scor_sentiment?review.scor_sentiment:"N/A"} / 5 </span>
            }
          </div>
          <div className="flex justify-between">
            <Rating rating={review.rating} />
            {
              isAdmin&&
              <span className="text-sm text-red-700">Toxicitate {review.scor_toxicitate?review.scor_toxicitate*100+" %":"N/A"}</span>
            }
          </div>
          <p className="text-gray-700">{review.continut}</p>
        </div>


      </div>

      <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${isLiked ? "text-emerald-600" : "text-gray-500"}`}
          onClick={handleLike}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{likeCount}</span>
        </Button>

        {
          isAdmin&&
          <DeleteReviewAlert reviewId={review.id} author={review.nume + " " +review.prenume} ></DeleteReviewAlert>
        }

        <ReportDialog reviewId={review.id} reviewerName={`${review.nume} ${review.prenume}`} />
      </div>
    </div>
  )
}
