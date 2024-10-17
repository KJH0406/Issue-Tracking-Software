"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { Button } from "./ui/button"
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet"

import Sidebar from "./sidebar"

// 모바일 환경에서 사이드바를 표시하는 컴포넌트
export const MobileSidebar = () => {
  // 사이드바 상태 관리(열림/닫힘)
  const [isOpen, setIsOpen] = useState(false)
  // 현재 경로 가져오기
  const pathname = usePathname()

  useEffect(() => {
    // 현재 경로가 변경될 때 사이드바 닫기
    setIsOpen(false)
  }, [pathname])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden">
          {/* 모바일 화면에서만 나타나는 메뉴 버튼 */}
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
       <Sidebar />
      </SheetContent>
    </Sheet>
  )
}