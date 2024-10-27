import { useMedia } from "react-use"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

import { Drawer, DrawerContent } from "@/components/ui/drawer"

// 반응형 모달 컴포넌트 타입
interface ResponsiveModalProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 반응형 모달 컴포넌트
export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
}: ResponsiveModalProps) => {
  // 데스크탑 모달 여부
  const isDesktop = useMedia("(min-width: 1024px)", true)

  // 데스크탑 모달
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
          <DialogTitle></DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  // 모바일 모달
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
