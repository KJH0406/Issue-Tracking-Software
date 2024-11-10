import { useParams } from "next/navigation"

// 프로젝트 ID 파라미터 훅
export const useProjectId = () => {
  // 프로젝트 ID 파라미터 가져오기
  const params = useParams()

  // 프로젝트 ID 반환
  return params.projectId as string
}
