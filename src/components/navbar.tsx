"use client"

import { usePathname } from "next/navigation"
import { UserButton } from "@/features/auth/components/user-button"
import { MobileSidebar } from "./mobile-sidebar"

export const pathnameMap = {
  tasks: {
    title: "내 페이지",
    description: "모든 일감들을 이곳에서 관리하세요.",
  },
  projects: {
    title: "프로젝트",
    description: "프로젝트에서 일감들을 관리하세요.",
  },
}

const defaultPathname = {
  title: "홈",
  description: "모든 프로젝트와 일감들을 이곳에서 관리하세요.",
}

// 네비게이션 바 컴포넌트
const Navbar = () => {
  const pathname = usePathname()
  const pathnameParts = pathname.split("/")
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap

  const { title, description } = pathnameMap[pathnameKey] || defaultPathname
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {/* 모바일 환경에서 사이드바 표시 */}
      <MobileSidebar />
      {/* 사용자 버튼 */}
      <UserButton />
    </nav>
  )
}

export default Navbar
