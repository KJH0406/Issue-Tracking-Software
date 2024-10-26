"use client"

// 외부 라이브러리 임포트
import { Loader } from "lucide-react"

// 전역 로딩 페이지 컴포넌트
const LoadingPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
      <p className="text-sm mt-4">로딩 중입니다. 잠시만 기다려주세요...</p>
    </div>
  )
}

export default LoadingPage
