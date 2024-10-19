import { useParams } from "next/navigation"

// 워크스페이스 ID 파라미터 가져오기
export const useWorkspaceId = () => {
  const params = useParams()
  return params.workspaceId as string
}
