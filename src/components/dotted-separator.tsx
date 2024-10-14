import React from "react"
import { cn } from "../lib/utils"

interface DottedSeparatorProps {
  className?: string
  color?: string
  height?: string
  dotSize?: string
  gapSize?: string
  direction?: "horizontal" | "vertical"
}

// 커스텀 점 구분선
export const DottedSeparator = ({
  className,
  color = "#d4d4d8", // 기본값 설정
  height = "2px", // 높이 기본값 설정
  dotSize = "2px", // 점 크기 기본값 설정
  gapSize = "6px", // 점 사이의 간격 기본값 설정
  direction = "horizontal", // 기본적으로 수평 방향
}: DottedSeparatorProps) => {
  const isHorizontal = direction === "horizontal"

  return (
    <div
      className={cn(
        isHorizontal
          ? "w-full flex items-center"
          : "h-full flex flex-col items-center",
        className
      )}
    >
      <div
        className={isHorizontal ? "flex-grow" : "flex-grow-0"}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
          backgroundSize: isHorizontal
            ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
            : `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          backgroundPosition: "center",
        }}
      />
    </div>
  )
}
