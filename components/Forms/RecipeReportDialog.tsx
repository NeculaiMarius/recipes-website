"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { reportRecipe } from "@/app/stores/RecipeStore"

export function RecipeReportDialog({recipeId,open,onOpenChange}: {recipeId: number, open: boolean,onOpenChange: (open: boolean) => void}) {
  const [category, setCategory] = useState("")
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = await reportRecipe(recipeId, category, details)
      if (success) {
        setCategory("")
        setDetails("")
        onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Raportează Rețeta</DialogTitle>
          <DialogDescription>
            Raportează această rețetă pentru conținut neadecvat sau alte probleme.
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
                <SelectItem value="fake">Rețetă Falsă</SelectItem>
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
              placeholder="Vă rugăm să oferiți mai multe informații..."
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
