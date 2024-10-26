// 외부 라이브러리 임포트
import { DottedSeparator } from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon } from "lucide-react"

// 일감 뷰 스위처 컴포넌트
export const TaskViewSwitcher = () => {
  return (
    <Tabs className="flex-1 w-full border rounded-lg" defaultValue="list">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row items-center justify-between">
          <TabsList className="w-full lg:w-auto bg-neutral-100 px-2 py-6">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="list">
              리스트
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              칸반
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              캘린더
            </TabsTrigger>
          </TabsList>
          <Button size="default" className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            일감 생성
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        필터 기능
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            테이블
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            칸반
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            캘린더
          </TabsContent>
        </>
      </div>
    </Tabs>
  )
}
