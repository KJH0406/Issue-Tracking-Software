"use client"

import { Loader, LogOut } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DottedSeparator } from "@/components/dotted-separator"

import { useLogout } from "@/features/auth/api/use-logout"
import { useCurrent } from "@/features/auth/api/use-current"
import { eachMonthOfInterval } from "date-fns"

// 사용자 버튼 컴포넌트
export const UserButton = () => {
  // 현재 로그인한 사용자 정보 가져오기
  const { data: user, isLoading } = useCurrent()

  // 로그아웃 함수 호출
  const { mutate: logout } = useLogout()

  if (isLoading) {
    // 로그인 중일 때 로딩 애니메이션 표시
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    // 로그인 하지 않은 경우 아무것도 표시하지 않음
    return null
  }

  // 사용자 정보 추출
  const { name, email } = user

  // 아바타 폴백 문자 생성
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U"
  return (
    <DropdownMenu modal={false}>
      {/* 드롭다운 메뉴 트리거 */}
      <DropdownMenuTrigger className="outline-none relative">
        {/* 아바타 컨테이너 */}
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      {/* 드롭다운 메뉴 컨텐츠 */}
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] transition border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          {/* 사용자 정보 표시 */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {name || "User"}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        {/* 로그아웃 메뉴 아이템 */}
        <DropdownMenuItem
          onClick={() => logout()}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
