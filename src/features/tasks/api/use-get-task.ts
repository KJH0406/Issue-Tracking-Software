import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

interface UseGetTaskProps {
  taskId: string
}

// 일감 상세 조회
export const useGetTask = ({ taskId }: UseGetTaskProps) => {
  // 사용자 인증 상태 조회
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      // 서버에서 일감 상세 조회
      const response = await client.api.tasks[":taskId"].$get({
        param: {
          taskId,
        },
      })

      // 서버 응답 실패 처리
      if (!response.ok) {
        throw new Error("일감 상세 조회 실패")
      }

      // 일감 상세 조회 JSON으로 파싱
      const { data } = await response.json()
      return data
    },
  })

  // 쿼리 결과 반환
  return query
}
