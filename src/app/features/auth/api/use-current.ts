import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useCurrent = () => {
  // 사용자 인증 상태 조회
  const query = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      // 서버에서 현재 사용자 정보를 가져오기
      const response = await client.api.auth.current.$get()

      // 서버 응답 실패 처리
      if (!response.ok) {
        return null
      }

      // 현재 사용자 정보 JSON으로 파싱
      const { data } = await response.json()
      return data
    },
  })

  // 쿼리 결과 반환
  return query
}
