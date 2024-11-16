import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"
import { InferResponseType } from "hono"

interface UseGetProjectAnalyticsProps {
  projectId: string
}

export type ProjectAnalyticsResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytics"]["$get"],
  200
>

// 프로젝트 가져오기
export const useGetProjectAnalytics = ({
  projectId,
}: UseGetProjectAnalyticsProps) => {
  // 사용자 인증 상태 조회
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      // 서버에서 현재 사용자 정보를 가져오기
      const response = await client.api.projects[":projectId"][
        "analytics"
      ].$get({
        param: { projectId },
      })

      // 서버 응답 실패 처리
      if (!response.ok) {
        throw new Error("프로젝트 분석 가져오기 실패")
      }

      // 현재 사용자 정보 JSON으로 파싱
      const { data } = await response.json()
      return data
    },
  })

  // 쿼리 결과 반환
  return query
}
