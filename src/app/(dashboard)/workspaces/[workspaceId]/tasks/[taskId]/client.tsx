"use client"

import { DottedSeparator } from "@/components/dotted-separator"
import { PageError } from "@/components/page-error"
import { PageLoader } from "@/components/page-loader"

import { useGetTask } from "@/features/tasks/api/use-get-task"
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs"
import { TaskDescription } from "@/features/tasks/components/task-description"
import { TaskOverview } from "@/features/tasks/components/task-overview"
import { useTaskId } from "@/features/tasks/hooks/use-task-id"

// 일감 ID 클라이언트 컴포넌트
export const TaskIdClient = () => {
  // 일감 ID 가져오기
  const taskId = useTaskId()
  const { data, isLoading } = useGetTask({ taskId })

  if (isLoading) return <PageLoader />

  if (!data)
    return <PageError message="일감을 불러오는 동안 오류가 발생했습니다." />

  return (
    <div className="flex flex-col gap-4">
      {/* 일감 브레드크럼 */}
      <TaskBreadcrumbs project={data.project} task={data} />
      <DottedSeparator />
      {/* 일감 상세 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  )
}
