"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useCurrent } from "@/app/features/auth/api/use-current"
import { useLogout } from "@/app/features/auth/api/use-logout"

import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  // 현재 사용자 데이터
  const { data, isLoading } = useCurrent()

  // 로그아웃 Mutation 함수
  const { mutate } = useLogout()

  useEffect(() => {
    // 사용자가 인증되지 않았고, 로딩이 끝난 경우 로그인 페이지로 리디렉션
    if (!data && !isLoading) {
      router.push("/sign-in")
    }
  }, [data])
  return (
    <div>
      인증된 사용자만 접근 가능한 페이지입니다.
      <Button
        onClick={() => {
          mutate()
        }}
      >
        로그아웃
      </Button>
    </div>
  )
}
