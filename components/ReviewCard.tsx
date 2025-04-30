"use client"

import Link from "next/link"
import { ThumbsUp, Flag } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ReviewRecipePage } from "@/interfaces/review"
import Rating from "./Rating"
import { likeReview, unlikeReview } from "@/app/stores/ReviewStore"
import { ReportDialog } from "./Forms/ReportDialog"


export default function ReviewCard({ review }:{review:ReviewRecipePage}) {
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
        <div>
          <Link href={`/Account/${review.id_utilizator}`}>
            <span className="block font-semibold text-gray-900 hover:text-emerald-700 hover:underline">
              {review.nume + " " + review.prenume}
            </span>
          </Link>
          <Rating rating={review.rating} />
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

        <ReportDialog reviewId={review.id} reviewerName={`${review.nume} ${review.prenume}`} />
      </div>
    </div>
  )
}
