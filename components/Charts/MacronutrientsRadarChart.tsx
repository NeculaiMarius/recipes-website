"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface MacronutrientChartProps {
  proteins: number
  carbs: number
  fats: number
  totalKcal: string
}

export default function MacronutrientRadarChart({
  proteins = 0,
  carbs = 0,
  fats = 0,
  totalKcal = "0",
}: MacronutrientChartProps) {
  // Prepare data for the radar chart
  const data = [
    { name: "Proteine", value: proteins, fullMark: Math.max(proteins, carbs, fats) * 1.2 },
    { name: "Carbohidrați", value: carbs, fullMark: Math.max(proteins, carbs, fats) * 1.2 },
    { name: "Grăsimi", value: fats, fullMark: Math.max(proteins, carbs, fats) * 1.2 },
  ]

  const chartConfig = {
    value: {
      label: "Value (g)",
    },
    proteins: {
      label: "Proteine",
      color: "hsl(var(--chart-1))",
    },
    carbs: {
      label: "Carbohidrați",
      color: "hsl(var(--chart-2))",
    },
    fats: {
      label: "Grăsimi",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card className="h-[324px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radar macronutrienți</CardTitle>
        <CardDescription>Macronutrienți per porție</CardDescription>
      </CardHeader>
    
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Radar
              name="value"
              dataKey="value"
              stroke="var(--color-proteins)"
              fill="var(--color-proteins)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
    </Card>
  )
}
