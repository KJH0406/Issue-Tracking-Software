import { Project } from "@/features/projects/types"
import { TaskStatus } from "../types"
import { cn } from "@/lib/utils"
import { MemberThumbnail } from "@/features/members/components/member-thumbnail"
import { ProjectThumbnail } from "@/features/projects/components/project-thumbnail"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { Member } from "@/features/members/types"

interface EventCardProps {
  title: string
  assignee: Member
  project: Project
  status: TaskStatus
  id: string
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-gray-500",
  [TaskStatus.IN_PROGRESS]: "border-l-blue-500",
  [TaskStatus.IN_REVIEW]: "border-l-yellow-500",
  [TaskStatus.CANCELLED]: "border-l-red-500",
  [TaskStatus.DONE]: "border-l-green-500",
}

// 이벤트 카드
export const EventCard: React.FC<EventCardProps> = ({
  title,
  assignee,
  project,
  status,
  id,
}) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  // 이벤트 카드 클릭 핸들러(클릭 시 해당 작업 상세 페이지로 이동)
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  return (
    <div className="px-2" onClick={onClick}>
      <div
        className={cn(
          "p-1.5 text-sx bg-white text-primary border rounded-md border-l-8 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberThumbnail name={assignee?.name} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectThumbnail name={project?.name} image={project?.imageUrl} />
        </div>
      </div>
    </div>
  )
}
