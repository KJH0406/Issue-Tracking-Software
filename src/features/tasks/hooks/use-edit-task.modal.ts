import { useQueryState, parseAsBoolean, parseAsString } from "nuqs"

// 일감 업데이트 모달 훅
export const useEditTaskModal = () => {
  // 일감 업데이트 모달 오픈 여부
  const [taskId, setTaskId] = useQueryState(
    // 쿼리 파라미터 키
    "edit-task",
    parseAsString
  )

  // 일감 업데이트 모달 오픈
  const open = (id: string) => setTaskId(id)
  // 일감 업데이트 모달 닫기
  const close = () => setTaskId(null)

  return {
    taskId,
    setTaskId,
    open,
    close,
  }
}
