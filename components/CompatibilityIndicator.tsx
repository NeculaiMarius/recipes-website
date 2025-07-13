interface CompatibilityIndicatorProps {
  percentage: number // 0 to 1
}

export default function CompatibilityIndicator({ percentage }: CompatibilityIndicatorProps) {
  const percentValue = Math.round(percentage * 100)

  // Color coding based on compatibility percentage
  const getColorClasses = (percent: number) => {
    if (percent >= 80) return "bg-green-500 border-green-600 text-white"
    if (percent >= 60) return "bg-yellow-500 border-yellow-600 text-white"
    if (percent >= 40) return "bg-orange-500 border-orange-600 text-white"
    return "bg-red-500 border-red-600 text-white"
  }

  const getMatchText = (percent: number) => {
    if (percent >= 80) return "Potrivire Excelentă"
    if (percent >= 60) return "Potrivire Bună"
    if (percent >= 40) return "Potrivire Acceptabilă"
    return "Potrivire Slabă"
  }

  return (
    <div className="mb-1 sm:mb-2 mx-1 sm:mx-2">
      <div
        className={`
      ${getColorClasses(percentValue)}
      rounded-md sm:rounded-lg border sm:border-2 px-2 py-1 sm:px-3 sm:py-2 shadow-sm
      flex items-center justify-between
      min-w-[120px] sm:min-w-[140px]
    `}
      >
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/80"></div>
          <span className="text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-none">
            {getMatchText(percentValue)}
          </span>
        </div>
        <span className="text-sm sm:text-lg font-bold ml-1">{percentValue}%</span>
      </div>

      {/* Progress bar */}
      <div className="mt-0.5 sm:mt-1 mx-0.5 sm:mx-1">
        <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
          <div
            className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
              percentValue >= 80
                ? "bg-green-500"
                : percentValue >= 60
                  ? "bg-yellow-500"
                  : percentValue >= 40
                    ? "bg-orange-500"
                    : "bg-red-500"
            }`}
            style={{ width: `${percentValue}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
