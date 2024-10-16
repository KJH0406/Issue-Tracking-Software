import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferResponseType } from "hono"

import { client } from "@/lib/rpc"
import { useRouter } from "next/navigation"

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>

// 로그아웃 처리
export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      // 서버에 로그아웃 요청
      const response = await client.api.auth.logout["$post"]()
      return await response.json()
    },

    // 로그아웃 성공 시 캐시된 현재 사용자 데이터 무효화(사용자 데이터 새로고침)
    // 로그인 페이지로 리디렉션
    onSuccess: () => {
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["current"] })
    },
  })

  return mutation
}
