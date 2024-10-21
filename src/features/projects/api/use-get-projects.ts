import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

interface UseGetProjectsProps {
  workspaceId: string
}

// 프로젝트 목록 가져오기
export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  // 사용자 인증 상태 조회
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      // 서버에서 현재 사용자 정보를 가져오기
      const response = await client.api.projects.$get({
        query: { workspaceId },
      })

      // 서버 응답 실패 처리
      if (!response.ok) {
        throw new Error("프로젝트 목록 가져오기 실패")
      }

      // 현재 사용자 정보 JSON으로 파싱
      const { data } = await response.json()
      return data
    },
  })

  // 쿼리 결과 반환
  return query
}
