"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
}

// 인증 페이지 레이아웃(로그인, 회원가입)
const AuthLayout = ({ children }: AuthLayoutProps) => {
  // 현재 페이지 경로
  const pathname = usePathname()

  // 페이지 전환 플레그(로그인 / 회원가입)
  const isSignIn = pathname === "/sign-in"

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" alt="logo" width={152} height={56} />
          <Button asChild variant="secondary">
            <Link href={isSignIn ? "/sign-up" : "sign-in"}>
              {isSignIn ? "회원가입" : "로그인"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  )
}

export default AuthLayout
