// React 및 외부 라이브러리
import { useCallback, useEffect, useState } from "react"
import { Task, TaskStatus } from "@/features/tasks/types"
import {
  DragDropContext, // 드래그 앤 드롭 기능을 위한 최상위 컨텍스트 컴포넌트
  Droppable, // 드롭 가능한 영역을 정의하는 컴포넌트
  Draggable, // 드래그 가능한 요소를 정의하는 컴포넌트
  DropResult, // 드래그 앤 드롭 결과 타입
} from "@hello-pangea/dnd"
import { KanbanColumnHeader } from "./kanban-column-header"
import { KanbanCard } from "./kanban-card"

// 칸반 보드의 각 상태 컬럼 정의
const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
  TaskStatus.CANCELLED,
]

// 각 상태별 일감 목록을 관리하기 위한 타입 정의
type TasksState = {
  [key in TaskStatus]: Task[]
}

interface DataKanbanProps {
  data: Task[] // 서버로부터 받은 일감 데이터 배열
  onChange: (
    tasks: {
      $id: string // 일감의 고유 식별자
      status: TaskStatus // 변경된 일감 상태
      position: number // 변경된 일감 위치
    }[]
  ) => void // 일감 상태/위치 변경 시 호출될 콜백 함수
}

// 칸반 보드 컴포넌트
export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  // 상태별 일감 관리를 위한 state 초기화
  const [tasks, setTasks] = useState<TasksState>(() => {
    // 각 상태별 빈 배열로 초기 상태 객체 생성
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.CANCELLED]: [],
    }

    // 받은 데이터를 해당하는 상태 배열에 분류
    data.forEach((task) => {
      initialTasks[task.status].push(task)
    })

    // 각 상태 배열 내에서 position 값 기준으로 정렬
    // position이 작은 일감이 위쪽에 위치하도록 함
    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
    })

    return initialTasks
  })

  // data prop이 변경될 때마다 tasks 상태 업데이트
  useEffect(() => {
    // 새로운 상태 객체 생성
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.CANCELLED]: [],
    }

    // 변경된 데이터를 상태별로 재분류
    data.forEach((task) => {
      newTasks[task.status].push(task)
    })

    // 각 상태 배열 내 일감들을 position 기준으로 재정렬
    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
    })

    setTasks(newTasks)
  }, [data])

  // 드래그 앤 드롭 완료 시 실행되는 핸들러
  const onDragEnd = useCallback(
    (result: DropResult) => {
      // 유효한 드롭 위치가 없으면 처리하지 않음
      if (!result.destination) return

      const { source, destination } = result
      const sourceStatus = source.droppableId as TaskStatus // 드래그 시작 컬럼의 상태
      const destStatus = destination.droppableId as TaskStatus // 드롭된 컬럼의 상태

      // 서버에 전송할 업데이트 데이터를 저장할 배열
      let updatesPayload: {
        $id: string
        status: TaskStatus
        position: number
      }[] = []

      // 일감 상태 업데이트 로직
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks }

        // 출발지 컬럼에서 드래그된 일감 제거
        const sourceColumn = [...newTasks[sourceStatus]]
        const [movedTask] = sourceColumn.splice(source.index, 1)

        // 일감이 존재하지 않으면 이전 상태 반환
        if (!movedTask) {
          console.error("일감을 찾을 수 없습니다.")
          return prevTasks
        }

        // 상태가 변경된 경우 일감 객체 업데이트
        const updatedMovedTask =
          sourceStatus !== destStatus
            ? {
                ...movedTask,
                status: destStatus,
              }
            : movedTask

        // 출발지 컬럼 업데이트
        newTasks[sourceStatus] = sourceColumn

        // 도착지 컬럼에 일감 추가
        const destColumn = [...newTasks[destStatus]]
        destColumn.splice(destination.index, 0, updatedMovedTask)
        newTasks[destStatus] = destColumn

        // 업데이트 페이로드 초기화
        updatesPayload = []

        // 이동된 일감의 새 위치 정보 추가
        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: destStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000),
        })

        // 도착지 컬럼의 다른 일감들의 position 재계산
        newTasks[destStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000)
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: destStatus,
                position: newPosition,
              })
            }
          }
        })

        // 출발지와 도착지가 다른 경우, 출발지 컬럼의 position도 재계산
        if (sourceStatus !== destStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 1_000_000)
              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                })
              }
            }
          })
        }
        return newTasks
      })

      // 변경사항을 부모 컴포넌트에 전달하여 서버 업데이트
      onChange(updatesPayload)
    },
    [onChange]
  )

  // 칸반 보드 UI 렌더링
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {/* 각 상태 컬럼을 매핑하여 렌더링 */}
        {boards.map((board) => (
          <div
            key={board}
            className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
          >
            {/* 컬럼 헤더 컴포넌트 */}
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
            {/* 드롭 가능 영역 정의 */}
            <Droppable droppableId={board}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px] py-1.5"
                >
                  {/* 해당 상태의 일감들을 매핑하여 렌더링 */}
                  {tasks[board].map((task, index) => (
                    <Draggable
                      key={task.$id}
                      draggableId={task.$id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {/* 개별 일감 카드 컴포넌트 */}
                          <KanbanCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
