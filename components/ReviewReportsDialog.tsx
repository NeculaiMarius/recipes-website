"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Report } from '@/interfaces/report';
import React, { useEffect, useState } from 'react'
import ReportCard from './ReportCard';
import { FaFileInvoice } from 'react-icons/fa6';
import { getReview, getReviewReports } from '@/app/stores/ReviewStore';
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Rating from "./Rating";
import { ReviewRecipePage } from "@/interfaces/review";

const ReviewReportsDialog = ({reviewId, reportsNumber}: {reviewId: number, reportsNumber: number}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [review,setReview] =useState<ReviewRecipePage>();
  const [open, setOpen] = useState(false);
  const [fetched, setFetched] = useState(false); 

  useEffect(() => {
    if (open && !fetched) {
      const getReports = async () => {
        try {
          const reviewReports = await getReviewReports(reviewId);
          setReports(reviewReports);

          const review=await getReview(reviewId);
          setReview(review)

          setFetched(true); 
        } catch (error) {
          console.error("Error getting reports:", error);
        }
      };
      getReports();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='rounded-full flex items-center gap-2 px-4 py-1 bg-amber-600 shadow-lg text-white w-fit font-bold'>
          {reportsNumber}
          <FaFileInvoice />
        </div>
      </DialogTrigger>
      <DialogContent className="h-[80%]">
  <DialogHeader className="h-fit">
    <DialogTitle>Rapoartele review-ului</DialogTitle>
  </DialogHeader>

  <div className="flex flex-col gap-2 overflow-auto">
    {!fetched ? (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-700" />
      </div>
    ) : (
      <>
      <div className="flex items-center gap-3 my-8">
        <Link href={`/Account/${review?.id_utilizator}`}>
          <Avatar className="h-12 w-12 border">
            <AvatarFallback>
              {((review?.nume?.[0] || '') + (review?.prenume?.[0] || '')).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link href={`/Account/${review?.id_utilizator}`}>
            <span className="block font-semibold text-gray-900 hover:text-emerald-700 hover:underline">
              {review?.nume + " " + review?.prenume}
            </span>
          </Link>
          <Rating rating={review?.rating as number} />
          <p className="text-gray-700">{review?.continut}</p>
        </div>
      </div>
      {
        reports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))
      }
      </>
    )}
  </div>
</DialogContent>

    </Dialog>
  )
}

export default ReviewReportsDialog;
