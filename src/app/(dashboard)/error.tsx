"use client"

// 외부 라이브러리 임포트
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

// UI 컴포넌트 임포트
import { Button } from "@/components/ui/button"

// 전역 오류 페이지 컴포넌트
const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col gap-y-4 items-center justify-center gap-4">
      <AlertTriangle className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        오류가 발생했습니다. 다시 시도해주세요.
      </p>
      <Button variant="secondary" size="sm" asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  )
}

export default ErrorPage
