"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface Ingredient {
  id: number
  nume: string
  categorie: string
  cantitate: number
  um: string
  // other fields...
}

interface IngredientCategoryCardProps {
  ingredients: Ingredient[]
}

export default function IngredientCategoryCard({ ingredients }: IngredientCategoryCardProps) {
  // Group ingredients by category and count them
  const categoryCount = ingredients.reduce(
    (acc, ingredient) => {
      const category = ingredient.categorie || "Uncategorized"
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to array for display and chart
  const categories = Object.entries(categoryCount).map(([name, value], index) => ({
    name,
    value,
    color: `hsl(var(--chart-${(index % 12) + 1}))`, // Use chart colors from shadcn
  }))

  // Sort categories by count (descending)
  categories.sort((a, b) => b.value - a.value)

  const totalIngredients = ingredients.length

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Categorii de ingrediente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr]">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ingrediente totale: <span className="font-medium">{totalIngredients}</span>
            </p>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{category.value}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((category.value / totalIngredients) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[250px] flex justify-center">
            <ChartContainer config={{}} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
