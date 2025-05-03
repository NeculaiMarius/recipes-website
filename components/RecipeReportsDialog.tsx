"use client"
import { getRecipeReports } from '@/app/stores/RecipeStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Report } from '@/interfaces/report';
import React, { useEffect, useState } from 'react'
import ReportCard from './ReportCard';
import { FaFileInvoice } from 'react-icons/fa6';

const RecipeReportsDialog = ({recipeId, reportsNumber}: {recipeId: number, reportsNumber: number}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [open, setOpen] = useState(false);
  const [fetched, setFetched] = useState(false); 

  useEffect(() => {
    if (open && !fetched) {
      const getReports = async () => {
        try {
          const recipeReports = await getRecipeReports(recipeId);
          setReports(recipeReports);
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
    <DialogTitle>Rapoartele rețetei</DialogTitle>
  </DialogHeader>

  <div className="flex flex-col gap-2 overflow-auto">
    {!fetched ? (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-700" />
      </div>
    ) : (
      reports.map(report => (
        <ReportCard key={report.id} report={report} />
      ))
    )}
  </div>
</DialogContent>

    </Dialog>
  )
}

export default RecipeReportsDialog;
