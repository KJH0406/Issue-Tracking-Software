import { useCallback, useEffect, useState } from "react"
import { Task, TaskStatus } from "@/features/tasks/types"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import { KanbanColumnHeader } from "./kanban-column-header"

// 칸반 보드 상태
const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
  TaskStatus.CANCELLED,
]

// 칸반 보드 상태에 따른 일감 상태
type TasksState = {
  [key in TaskStatus]: Task[]
}

interface DataKanbanProps {
  data: Task[]
}

// 칸반 뷰
export const DataKanban = ({ data }: DataKanbanProps) => {
  // 칸반 보드 상태에 따른 일감 상태
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.CANCELLED]: [],
    }

    // 일감 상태에 따른 일감 정렬
    data.forEach((task) => {
      initialTasks[task.status].push(task)
    })

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
    })

    return initialTasks
  })

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div
            key={board}
            className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
          >
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
