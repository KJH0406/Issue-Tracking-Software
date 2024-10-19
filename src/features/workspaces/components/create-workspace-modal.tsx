"use client"

import { ResponsiveModal } from "@/components/responsive-modal"

import { CreateWorkspaceForm } from "./create-workspace-form"
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace.modal"

// 워크스페이스 생성 모달 컴포넌트
export const CreateWorkspaceModal = () => {
  // 워크스페이스 생성 모달 오픈 여부
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal()
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  )
}
