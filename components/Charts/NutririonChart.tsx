"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface NutritionData {
  name: string;
  value: number;
  fill: string;
}

const chartConfig: ChartConfig = {
  carbs: {
    label: "Carbohidrați",
    color: "hsl(37.7 92.1% 50.2%)",
  },
  proteins: {
    label: "Proteine",
    color: "hsl(173.4 80.4% 40%)",
  },
  fats: {
    label: "Grăsimi",
    color: "hsl(333.3 71.4% 50.6%)",
  },
}

export default function NutritionChart({ data,totalKcal }: {data:NutritionData[],totalKcal:string}) {
  const totalNutrients = React.useMemo(() => {
    return data.reduce((acc: number, curr: NutritionData) => acc + curr.value, 0);
  }, [data]);

  return (
    <Card className="flex w-fit">
      <div>
      <CardHeader className="items-center pb-0">
        <CardTitle>Compoziție Nutrițională</CardTitle>
        <CardDescription>Macronutrienți per rețetă</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalNutrients.toLocaleString()}g
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Macronutrienți
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Date nutriționale pe bază de rețetă
        </div>
      </CardFooter>
      </div>
      <div className="flex flex-col items-center justify-center pr-6">
        <h1 className="text-2xl font-bold">Total kcal rețetă</h1>
        <p className="text-xl font-extrabold text-red-700">{totalKcal} Kcal</p>
      </div>
    </Card>
  )
}
