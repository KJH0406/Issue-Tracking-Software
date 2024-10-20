import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

interface UseGetMembersProps {
  workspaceId: string
}

// 멤버 목록 가져오기
export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  // 멤버 목록 쿼리
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      // 멤버 목록 가져오기
      const response = await client.api.members.$get({
        query: {
          workspaceId,
        },
      })

      // 서버 응답 실패 처리
      if (!response.ok) {
        throw new Error("멤버 목록 가져오기 실패")
      }

      // 멤버 목록 JSON으로 파싱
      const { data } = await response.json()
      return data
    },
  })

  // 쿼리 결과 반환
  return query
}
