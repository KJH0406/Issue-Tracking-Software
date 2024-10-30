import { Button } from "@/components/ui/button"
import { Task } from "../types"
import { PencilIcon, XIcon } from "lucide-react"
import { DottedSeparator } from "@/components/dotted-separator"
import { useState } from "react"
import { useUpdateTask } from "../api/use-update-task"
import { Textarea } from "@/components/ui/textarea"

interface TaskDescriptionProps {
  task: Task
}

// 일감 설명 컴포넌트
export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  // 수정 상태
  const [isEditing, setIsEditing] = useState(false)

  // 수정 값
  const [value, setValue] = useState(task.description)

  // 수정 요청
  const { mutate, isPending } = useUpdateTask()

  // 수정 저장
  const handleSave = () => {
    mutate({
      json: { description: value },
      param: {
        taskId: task.$id,
      },
    })
    setIsEditing(false)
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">설명</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? (
            <XIcon className="size-4 mr-2" />
          ) : (
            <PencilIcon className="size-4 mr-2" />
          )}
          {isEditing ? "취소" : "수정"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            value={value}
            placeholder="설명을 입력하세요."
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
          <Button
            variant="primary"
            size="sm"
            className="w-fit ml-auto"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "저장중..." : "저장"}
          </Button>
        </div>
      ) : (
        // 설명
        <div>
          {task.description || (
            <span className="text-muted-foreground">설명이 없습니다.</span>
          )}
        </div>
      )}
    </div>
  )
}
