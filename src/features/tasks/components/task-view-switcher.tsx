"use client"

// 아이콘 임포트
import { Loader, PlusIcon } from "lucide-react"

// 외부 라이브러리 임포트
import { useQueryState } from "nuqs"

// 커스텀 훅 임포트
import { useCreateTaskModal } from "../hooks/use-create-task.modal"
import { useGetTasks } from "../api/use-get-tasks"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

// UI 컴포넌트 임포트
import { DottedSeparator } from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataFilters } from "./data-filters"
import { useTaskFilters } from "../hooks/use-task-filters"
import { DataTable } from "./data-table"
import { columns } from "./columns"

// 일감 뷰 스위처 컴포넌트
export const TaskViewSwitcher = () => {
  const { open } = useCreateTaskModal()

  // 일감 필터 상태 관리
  const [{ status, projectId, assigneeId, dueDate }] = useTaskFilters()

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
              <DataTable columns={columns} data={tasks?.documents || []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}
