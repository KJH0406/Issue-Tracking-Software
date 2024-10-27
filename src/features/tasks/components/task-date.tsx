import { cn } from "@/lib/utils"
import { differenceInDays, format } from "date-fns"
import { ko } from "date-fns/locale"

interface TaskDateProps {
  value: string
  className?: string
}

// 일감 마감일 형식 컴포넌트
export const TaskDate = ({ value, className }: TaskDateProps) => {
  const today = new Date()
  const endDate = new Date(value)
  const diffInDays = differenceInDays(endDate, today)

  // 마감일 색상 설정
  let textColor = "text-muted-foreground"
  // 마감일 기한 별 색상 코드
  if (diffInDays <= 3) {
    textColor = "text-red-500"
  } else if (diffInDays <= 7) {
    textColor = "text-yellow-500"
  } else if (diffInDays <= 14) {
    textColor = "text-green-500"
  }

  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>
        {format(new Date(value), "PPP", { locale: ko })}
      </span>
    </div>
  )
}
