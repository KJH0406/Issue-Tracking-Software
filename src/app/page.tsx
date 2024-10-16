"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useCurrent } from "@/app/features/auth/api/use-current"

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useCurrent()

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in")
    }
  }, [data])
  return <div>인증된 사용자만 접근 가능한 페이지입니다.</div>
}
