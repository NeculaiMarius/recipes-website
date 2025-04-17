"use client"

import * as React from "react"
import { Clock, Pause, Play, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePathname } from "next/navigation"

export function Timer() {
  const pathname = usePathname()

  const [hours, setHours] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)
  const [timeLeft, setTimeLeft] = React.useState(0)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  // Handle input changes with validation
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setHours(Math.max(0, Math.min(23, value)))
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setMinutes(Math.max(0, Math.min(59, value)))
  }

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setSeconds(Math.max(0, Math.min(59, value)))
  }

  // Start or pause the timer
  const toggleTimer = () => {
    if (!isRunning) {
      // If starting the timer, calculate total seconds
      if (timeLeft === 0) {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        if (totalSeconds === 0) return // Don't start if no time is set
        setTimeLeft(totalSeconds)
      }
    }
    setIsRunning(!isRunning)
  }

  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(0)
  }

  // Format time for display
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - play sound
            if (audioRef.current) {
              audioRef.current.play().catch((err) => console.error("Error playing audio:", err))
            }
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  if (!["/Discover-recipes/Recipe-page"].includes(pathname)) {
    return <div className="hidden"></div>
  }

  return (
    <Drawer >
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-800 border-[3px] flex items-center gap-2 px-4 py-2 rounded-md shadow-sm"
        >
          <Clock size={33} />
          {timeLeft === 0 ? (
            <span className="font-bold">Cronometru</span>
          ) : (
            <span className="text-gray-800 font-bold">{formatTime(timeLeft)}</span>
          )}
          
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white border-t-2 border-gray-300 max-lg:w-full lg:w-fit mx-auto lg:px-[10vw]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="border-b border-gray-200">
            <DrawerTitle className="text-emerald-800">Cronometru</DrawerTitle>
            <DrawerDescription>Setați un cronometru și primiți o notificare când timpul s-a scurs.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {timeLeft === 0 ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hours" className="text-gray-700 font-bold">
                    Ore
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={handleHoursChange}
                    className="text-center focus:border-gray-500 focus:ring-gray-500 border-2"
                  />
                </div>
                <div>
                  <Label htmlFor="minutes" className="text-gray-700 font-bold">
                    Minute
                  </Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={handleMinutesChange}
                    className="text-center focus:border-gray-500 focus:ring-gray-500 border-2 "
                  />
                </div>
                <div>
                  <Label htmlFor="seconds" className="text-gray-700 font-bold">
                    Secunde
                  </Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={handleSecondsChange}
                    className="text-center focus:border-gray-500 focus:ring-gray-500 border-2"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="text-7xl font-bold tracking-tighter tabular-nums text-gray-800">
                  {formatTime(timeLeft)}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-center space-x-4">
              <Button
                onClick={toggleTimer}
                className="w-30 bg-emerald-700 hover:bg-emerald-800 text-white gap-2"
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? "Pauză" : "Start"}
              </Button>
              <Button
                variant="outline"
                onClick={resetTimer}
                className="w-30 border-emerald-700 text-emerald-700 font-semibold hover:bg-gray-100 border-[3px] gap-2"
              >
                <RotateCcw size={20} />
                Resetare
              </Button>
            </div>
          </div>
          <DrawerFooter className="border-t border-gray-200">
            <DrawerClose asChild>
              <Button variant="outline" className="border-emerald-700 border-[3px] text-emerald-700 font-bold hover:bg-gray-100">
                Ascunde
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>

      {/* Audio element for alarm sound */}
      <audio ref={audioRef} preload="auto">
        <source src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </Drawer>
  )
}
