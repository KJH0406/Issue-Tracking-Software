import { PencilIcon } from "lucide-react"

import { Task } from "../types"

import { Button } from "@/components/ui/button"
import { DottedSeparator } from "@/components/dotted-separator"
import { OverviewProperty } from "./overview-property"
import { MemberThumbnail } from "@/features/members/components/member-thumbnail"
import { TaskDate } from "./task-date"
import { TaskStatusBadge } from "./task-status-badge"
import { useEditTaskModal } from "../hooks/use-edit-task.modal"

interface TaskOverviewProps {
  task: Task
}

// 일감 오버뷰 컴포넌트
export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal()

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        {/* 오버뷰 헤더 */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">일감 정보</p>
          <Button variant="secondary" size="sm" onClick={() => open(task.$id)}>
            <PencilIcon className="size-4 mr-2" />
            수정
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        {/* 오버뷰 본문 */}
        <div className="flex flex-col gap-y-4">
          {/* 담당자 */}
          <OverviewProperty label="담당자">
            <MemberThumbnail name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          {/* 마감일 */}
          <OverviewProperty label="마감일">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          {/* 상태 */}
          <OverviewProperty label="상태">
            <TaskStatusBadge status={task.status} />
          </OverviewProperty>
        </div>
      </div>
    </div>
  )
}
