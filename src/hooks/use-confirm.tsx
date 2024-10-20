import { useState } from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { ResponsiveModal } from "@/components/responsive-modal"

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

// 확인 다이얼로그 커스텀 훅
export const useConfirm = (
  // 제목, 메시지, 버튼 스타일을 매개변수로 받음
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "primary"
): [() => JSX.Element, () => Promise<unknown>] => {
  // promise가 null이 아닐 때 모달이 열림
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  // 확인 함수: 새로운 Promise를 생성하고 resolve 함수를 promise 상태에 저장
  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve })
    })
  }

  // 모달 닫기 함수: promise 상태를 null로 설정
  const handleClose = () => {
    setPromise(null)
  }

  // 확인 버튼 클릭 시 실행되는 함수
  const handleConfirm = () => {
    promise?.resolve(true) // Promise를 true로 resolve
    handleClose()
  }

  // 취소 버튼 클릭 시 실행되는 함수
  const handleCancel = () => {
    promise?.resolve(false) // Promise를 false로 resolve
    handleClose()
  }

  // 확인 다이얼로그 컴포넌트
  const ConfirmDialog = () => (
    <ResponsiveModal open={promise != null} onOpenChange={handleClose}>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="pt-8">
          <CardHeader className="p-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div className="pt-4 flex flex-col gap-y-4 lg:flex-row gap-x-2 items-center justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full lg:w-auto"
            >
              취소
            </Button>
            <Button
              variant={variant}
              onClick={handleConfirm}
              className="w-full lg:w-auto"
            >
              확인
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  )

  // ConfirmDialog 컴포넌트와 confirm 함수를 반환
  return [ConfirmDialog, confirm]
}
