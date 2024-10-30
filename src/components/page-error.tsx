import { AlertTriangle } from "lucide-react"

interface PageErrorProps {
  message: string
}

// 페이지 에러 컴포넌트
export const PageError = ({
  message = "페이지를 불러오는 동안 오류가 발생했습니다.",
}: PageErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertTriangle className="size-6 text-muted-foreground mb-2" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  )
}
