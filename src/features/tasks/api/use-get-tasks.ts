import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

interface UseGetTasksProps {
  workspaceId: string
}

// 일감 목록 가져오기
export const useGetTasks = ({ workspaceId }: UseGetTasksProps) => {
  // 사용자 인증 상태 조회
  const query = useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      // 서버에서 일감 목록 가져오기
      const response = await client.api.tasks.$get({
        query: { workspaceId },
      })

      // 서버 응답 실패 처리
      if (!response.ok) {
        throw new Error("일감 목록 가져오기 실패")
      }

      // 일감 목록 JSON으로 파싱
      const { data } = await response.json()
      return data
    },
  })

  // 쿼리 결과 반환
  return query
}
