"use client"

import { ResponsiveModal } from "@/components/responsive-modal"

import { CreateProjectForm } from "./create-project-form"
import { useCreateProjectModal } from "../hooks/use-create-project.modal"

// 프로젝트 생성 모달 컴포넌트
export const CreateProjectModal = () => {
  // 프로젝트 생성 모달 오픈 여부
  const { isOpen, setIsOpen, close } = useCreateProjectModal()
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  )
}
