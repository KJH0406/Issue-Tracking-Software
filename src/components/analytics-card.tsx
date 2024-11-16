import { FaCaretUp, FaCaretDown } from "react-icons/fa"

import { cn } from "@/lib/utils"

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

interface AnalyticsCardProps {
  title: string
  value: number
  variant: "up" | "down" | "neutral"
  increaseValue?: number
}

export const AnalyticsCard = ({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticsCardProps) => {
  // 아이콘 색상 설정
  const iconColor =
    variant === "up"
      ? "text-emerald-500"
      : variant === "down"
      ? "text-red-500"
      : "text-gray-400"

  const increaseValueColor =
    variant === "up"
      ? "text-emerald-500"
      : variant === "down"
      ? "text-red-500"
      : "text-gray-400"

  const Icon =
    variant === "up" ? FaCaretUp : variant === "down" ? FaCaretDown : FaCaretUp

  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={cn("size-4", iconColor)} />
            <span
              className={cn(
                "truncate text-base font-medium",
                increaseValueColor
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
