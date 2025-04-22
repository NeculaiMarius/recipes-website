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
    const value = e.target.value.replace(/[^0-9]/g, "")
    const numValue = value === "" ? 0 : Number.parseInt(value)
    setHours(Math.max(0, Math.min(23, numValue)))
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    const numValue = value === "" ? 0 : Number.parseInt(value)
    setMinutes(Math.max(0, Math.min(59, numValue)))
  }

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    const numValue = value === "" ? 0 : Number.parseInt(value)
    setSeconds(Math.max(0, Math.min(59, numValue)))
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
    <Drawer>
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
                <div className="flex flex-col items-center">
                  <Label htmlFor="hours" className="text-gray-700 font-bold mb-4">
                    Ore
                  </Label>
                  <div className="flex flex-col items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-b-none border-b-0"
                      onClick={() => setHours((prev) => Math.min(23, prev + 1))}
                    >
                      +
                    </Button>
                    <Input
                      id="hours"
                      type="text"
                      inputMode="numeric"
                      value={hours}
                      onChange={handleHoursChange}
                      className="text-center focus:border-gray-500 focus:ring-gray-500 border-2 rounded-none h-10"
                      onFocus={(e) => e.target.select()}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-t-none border-t-0"
                      onClick={() => setHours((prev) => Math.max(0, prev - 1))}
                    >
                      -
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Label htmlFor="minutes" className="text-gray-700 font-bold mb-4">
                    Minute
                  </Label>
                  <div className="flex flex-col items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-b-none border-b-0"
                      onClick={() => setMinutes((prev) => Math.min(59, prev + 1))}
                    >
                      +
                    </Button>
                    <Input
                      id="minutes"
                      type="text"
                      inputMode="numeric"
                      value={minutes}
                      onChange={handleMinutesChange}
                      className="text-center focus:border-gray-500 focus:ring-gray-500 border-2 rounded-none h-10"
                      onFocus={(e) => e.target.select()}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-t-none border-t-0"
                      onClick={() => setMinutes((prev) => Math.max(0, prev - 1))}
                    >
                      -
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Label htmlFor="seconds" className="text-gray-700 font-bold mb-4">
                    Secunde
                  </Label>
                  <div className="flex flex-col items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-b-none border-b-0"
                      onClick={() => setSeconds((prev) => Math.min(59, prev + 1))}
                    >
                      +
                    </Button>
                    <Input
                      id="seconds"
                      type="text"
                      inputMode="numeric"
                      value={seconds}
                      onChange={handleSecondsChange}
                      className="text-center focus:border-gray-500 focus:ring-gray-500 border-2 rounded-none h-10"
                      onFocus={(e) => e.target.select()}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-t-none border-t-0"
                      onClick={() => setSeconds((prev) => Math.max(0, prev - 1))}
                    >
                      -
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="text-7xl font-bold tracking-tighter tabular-nums text-gray-800">
                  {formatTime(timeLeft)}
                </div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHours(0)
                  setMinutes(1)
                  setSeconds(0)
                }}
                className="text-xs"
              >
                1 min
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHours(0)
                  setMinutes(5)
                  setSeconds(0)
                }}
                className="text-xs"
              >
                5 min
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHours(0)
                  setMinutes(10)
                  setSeconds(0)
                }}
                className="text-xs"
              >
                10 min
              </Button>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <Button onClick={toggleTimer} className="w-30 bg-emerald-700 hover:bg-emerald-800 text-white gap-2">
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
              <Button
                variant="outline"
                className="border-emerald-700 border-[3px] text-emerald-700 font-bold hover:bg-gray-100"
              >
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
