"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import { reportReview } from "@/app/stores/ReviewStore"

interface ReportDialogProps {
  reviewId: number
  reviewerName: string
}

export function ReportDialog({ reviewId, reviewerName }: ReportDialogProps) {
  const [category, setCategory] = useState("")
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success=await reportReview(reviewId,category,details);
      if(success){

        setCategory("")
        setDetails("")
        setOpen(false)
        alert("Raport trimis cu succes")
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      alert("Eroare la trimiterea raportului. Vă rugăm să încercați din nou.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
          <Flag className="h-4 w-4 mr-1" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Raportează Recenzia</DialogTitle>
          <DialogDescription>
            Raportează această recenzie a utilizatorului {reviewerName} pentru conținut neadecvat sau alte probleme.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Categorie Raport
            </label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selectează un motiv" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inappropriate">Conținut Neadecvat</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="fake">Recenzie Falsă</SelectItem>
                <SelectItem value="offensive">Limbaj Ofensator</SelectItem>
                <SelectItem value="other">Altele</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="details" className="text-sm font-medium">
              Detalii Suplimentare
            </label>
            <Textarea
              id="details"
              placeholder="Vă rugăm să oferiți mai multe informații despre raportul dvs..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !category}>
              {isSubmitting ? "Se trimite..." : "Trimite Raport"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
