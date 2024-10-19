"use client"

import { useRouter } from "next/navigation"

import { RiAddCircleFill } from "react-icons/ri"

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { WorkspaceThumbnail } from "@/features/workspaces/components/workspace-thumbnail"
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace.modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 워크스페이스 셀렉터
export const WorkspaceSelector = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  // 워크스페이스 목록 가져오기
  const { data: workspaces } = useGetWorkspaces()

  // 워크스페이스 생성 모달 오픈
  const { open } = useCreateWorkspaceModal()

  // 워크스페이스 상세 페이지 리디렉션
  const onSelect = (id: string) => {
    // 워크스페이스 상세 페이지로 이동
    router.push(`/workspaces/${id}`)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">워크스페이스</p>
        <RiAddCircleFill
          onClick={open} // 워크스페이스 생성 모달 오픈
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="워크스페이스 선택" />
        </SelectTrigger>
        <SelectContent>
          {/* 워크스페이스 목록 출력 */}
          {workspaces?.documents?.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceThumbnail
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
