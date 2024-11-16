import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  PlusIcon,
  CircleXIcon,
} from "lucide-react"

import { TaskStatus } from "../types"
import { Button } from "@/components/ui/button"
import { useCreateTaskModal } from "../hooks/use-create-task.modal"

const statusLabelMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "대기",
  [TaskStatus.IN_PROGRESS]: "진행",
  [TaskStatus.IN_REVIEW]: "검토",
  [TaskStatus.DONE]: "완료",
  [TaskStatus.CANCELLED]: "취소",
}

interface KanbanColumnHeaderProps {
  board: TaskStatus
  taskCount: number
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-18px text-pink-400" />
  ),
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotIcon className="size-18px text-blue-400" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotDashedIcon className="size-18px text-yellow-400" />
  ),
  [TaskStatus.DONE]: <CircleCheckIcon className="size-18px text-green-400" />,
  [TaskStatus.CANCELLED]: <CircleXIcon className="size-18px text-red-400" />,
}

// 칸반 보드 헤더
export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  // 일감 생성 모달 상태 관리
  const { open } = useCreateTaskModal()

  // 상태에 따른 아이콘
  const Icon = statusIconMap[board]
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {Icon}
        <h2 className="text-sm font-medium">{statusLabelMap[board]}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>
      {/* 일감 생성 버튼 */}
      <Button variant="ghost" size="icon" className="size-8" onClick={open}>
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  )
}
