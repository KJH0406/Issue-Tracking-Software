"use client"

// React 및 외부 라이브러리
import { useCallback } from "react"
import { useQueryState } from "nuqs"
import { Loader, PlusIcon } from "lucide-react"

// 일감 로직 관련 훅
import { useCreateTaskModal } from "../hooks/use-create-task.modal"
import { useGetTasks } from "../api/use-get-tasks"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useTaskFilters } from "../hooks/use-task-filters"

// UI 컴포넌트
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DottedSeparator } from "@/components/dotted-separator"
import { DataFilters } from "./data-filters"
import { DataTable } from "./data-table"
import { DataKanban } from "./data-kanban"
import { DataCalendar } from "./data-calendar"
import { columns } from "./columns"

// 타입
import { TaskStatus } from "../types"
import { useBulkUpdateTask } from "../api/use-bulk-update-task"

// 일감 뷰 스위처 컴포넌트
export const TaskViewSwitcher = () => {
  const { open } = useCreateTaskModal()

  // 일감 필터 상태 관리
  const [{ status, projectId, assigneeId, dueDate }] = useTaskFilters()

  // 일감 대량 업데이트 뮤테이션
  const { mutate: bulkUpdate } = useBulkUpdateTask()

  // 일감 뷰 상태 관리
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  })

  // 현재 활성화된 작업 공간의 ID를 가져오기
  const workspaceId = useWorkspaceId()

  // 현재 작업 공간의 일감 목록을 가져오기
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId,
    assigneeId,
    status,
    dueDate,
  })

  // 칸반 카드 상태 변경 핸들러
  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({ json: { tasks } })
    },
    [bulkUpdate]
  )

  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row items-center justify-between">
          <TabsList className="w-full lg:w-auto bg-neutral-100 px-2 py-6">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              리스트
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              칸반
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              캘린더
            </TabsTrigger>
          </TabsList>
          <Button size="default" className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4 mr-2" />
            일감 생성
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                data={tasks?.documents ?? []}
                onChange={onKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}
