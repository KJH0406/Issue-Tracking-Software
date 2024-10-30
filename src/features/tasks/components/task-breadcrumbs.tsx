// 외부 라이브러리
import Link from "next/link"

// 타입
import { Project } from "@/features/projects/types"
import { Task } from "../types"

// 컴포넌트
import { ProjectThumbnail } from "@/features/projects/components/project-thumbnail"
import { Button } from "@/components/ui/button"

// 아이콘
import { ChevronRight, TrashIcon } from "lucide-react"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useConfirm } from "@/hooks/use-confirm"
import { useDeleteTask } from "../api/use-delete-task"
import { useRouter } from "next/navigation"

interface TaskBreadcrumbsProps {
  project: Project
  task: Task
}

// 일감 브레드크럼 컴포넌트
export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  // 워크스페이스 ID
  const workspaceId = useWorkspaceId()

  // 라우터
  const router = useRouter()

  // 일감 삭제 뮤테이션
  const { mutate, isPending } = useDeleteTask()

  // 일감 삭제 다이얼로그
  const [ConfirmDeleteDialog, confirmDelete] = useConfirm(
    "⚠️ 일감 삭제",
    "일감을 삭제하면 일감에 속한 모든 데이터가 삭제되며 복구할 수 없습니다.",
    "destructive"
  )

  // 일감 삭제 함수
  const handleDeleteTask = async () => {
    const result = await confirmDelete()
    if (!result) return

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          // 내 페이지로 이동
          router.push(`/workspaces/${workspaceId}/tasks`)
        },
      }
    )
  }

  return (
    <div className="flex items-center gap-x-2">
      {/* 일감 삭제 다이얼로그 */}
      <ConfirmDeleteDialog />

      {/* 프로젝트 썸네일*/}
      <ProjectThumbnail
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />

      {/* 클릭 시 해당 프로젝트 페이지로 이동하는 프로젝트 이름 */}
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />

      {/* 태스크 이름 */}
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>

      {/* 삭제 버튼 */}
      <Button
        className="ml-auto"
        variant="destructive"
        size="sm"
        onClick={handleDeleteTask}
        disabled={isPending}
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">삭제</span>
      </Button>
    </div>
  )
}
