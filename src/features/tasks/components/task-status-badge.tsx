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
  BACKLOG: { label: "대기", className: "bg-gray-600 hover:bg-gray-700" },
  IN_PROGRESS: { label: "진행", className: "bg-blue-600 hover:bg-blue-700" },
  IN_REVIEW: { label: "검토", className: "bg-yellow-500 hover:bg-yellow-600" },
  DONE: { label: "완료", className: "bg-green-600 hover:bg-green-700" },
  CANCELLED: { label: "취소", className: "bg-red-600 hover:bg-red-700" },
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const { label, className } = statusMap[status]
  return <Badge className={className}>{label}</Badge>
}
