// UI 컴포넌트 임포트
import { Card, CardContent } from "@/components/ui/card"

// API 훅 임포트
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useGetProjects } from "@/features/projects/api/use-get-projects"

// 유틸리티 훅 임포트
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

// 아이콘 임포트
import { Loader } from "lucide-react"
import { useGetTask } from "../api/use-get-task"
import { EditTaskForm } from "./edit-task-form"

interface EditTaskFormWrapperProps {
  onCancel: () => void
  id: string
}

// 일감 업데이트 폼 래퍼 컴포넌트
export const EditTaskFormWrapper = ({
  onCancel,
  id,
}: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId()

  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  })

  // 프로젝트 조회
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  })
  // 멤버 조회
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  })

  // 프로젝트 옵션
  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }))

  // 멤버 옵션
  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }))

  // 로딩 여부
  const isLoading = isLoadingTask || isLoadingProjects || isLoadingMembers

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!initialValues) {
    return null
  }

  return (
    <EditTaskForm
      initialValues={initialValues}
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
    />
  )
}
