// 아이콘 컴포넌트 import
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react"

// UI 컴포넌트 import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useConfirm } from "@/hooks/use-confirm"
import { useDeleteTask } from "../api/use-delete-task"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useEditTaskModal } from "../hooks/use-edit-task.modal"

// TaskActions 컴포넌트의 props 타입
interface TaskActionsProps {
  id: string
  projectId: string
  children: React.ReactNode
}

// 일감 관련 액션 드롭다운 메뉴 컴포넌트
export function TaskActions({ id, projectId, children }: TaskActionsProps) {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { open } = useEditTaskModal()

  // 일감 삭제 확인 모달 컴포넌트
  const [ConfirmDialog, confirm] = useConfirm(
    "일감 삭제",
    "일감을 삭제하시겠습니까?",
    "destructive"
  )
  const { mutate, isPending } = useDeleteTask()

  // 일감 삭제 함수
  const onDelete = async () => {
    const confirmed = await confirm()

    if (!confirmed) {
      return
    }
    mutate({ param: { taskId: id } })
  }

  // 일감 상세 페이지로 이동하는 함수
  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  // 프로젝트 상세 페이지로 이동하는 함수
  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
  }

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* 일감 상세 메뉴 */}
          <DropdownMenuItem
            onClick={onOpenTask}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            일감 상세
          </DropdownMenuItem>

          {/* 프로젝트 상세 메뉴*/}
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            프로젝트 상세
          </DropdownMenuItem>

          {/* 일감 편집 메뉴*/}
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            일감 편집
          </DropdownMenuItem>

          {/* 일감 삭제 메뉴*/}
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-red-500 focus:text-red-500 font-medium p-[10px]"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            일감 삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
