import { Badge } from "@/components/ui/badge"
import { TaskStatus } from "../types"

interface TaskStatusBadgeProps {
  status: TaskStatus
}

const statusMap: Record<
  TaskStatus,
  {
    label: string
    className: string
  }
> = {
  BACKLOG: { label: "대기", className: "bg-neutral-400 hover:bg-neutral-500" },
  IN_PROGRESS: { label: "진행", className: "bg-blue-400 hover:bg-blue-500" },
  IN_REVIEW: { label: "검토", className: "bg-yellow-400 hover:bg-yellow-500" },
  DONE: { label: "완료", className: "bg-green-400 hover:bg-green-500" },
  CANCELLED: { label: "취소", className: "bg-red-400 hover:bg-red-500" },
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const { label, className } = statusMap[status]
  return <Badge className={className}>{label}</Badge>
}
