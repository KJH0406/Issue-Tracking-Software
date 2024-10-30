import { useParams } from "next/navigation"

// 일감 ID 파라미터 훅
export const useTaskId = () => {
  // 일감 ID 파라미터 가져오기
  const params = useParams()

  // 일감 ID 반환
  return params.taskId as string
}
