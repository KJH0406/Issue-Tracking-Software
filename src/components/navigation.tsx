"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

import {
  GoHome,
  GoHomeFill,
  GoCheckCircle,
  GoCheckCircleFill,
} from "react-icons/go"

import { SettingsIcon, UsersIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// 네비게이션 라우트 정의
const routes = [
  // 홈 라우트
  {
    label: "홈",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  // 일감 라우트
  {
    label: "내 페이지",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  // 설정 라우트
  {
    label: "설정",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  // 멤버 라우트
  {
    label: "사용자",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
]

// 네비게이션 컴포넌트
export const Navigation = () => {
  const pathname = usePathname()
  const workspaceId = useWorkspaceId()

  return (
    <div className="flex flex-col">
      {/* 네비게이션 라우트 */}
      {routes.map((item) => {
        // 전체 경로 생성
        const fullHref = `/workspaces/${workspaceId}${item.href}`

        // 현재 경로와 비교하여 활성 상태 확인
        const isActive = pathname === fullHref

        // 활성 상태에 따라 아이콘 선택
        const Icon = isActive ? item.activeIcon : item.icon

        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              {/* 아이콘 표시 */}
              <Icon className="size-5 text-neutral-500" />
              {/* 라벨 표시 */}
              {item.label}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
