import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { client } from "@/lib/rpc"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>
type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>

export const useLogin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login["$post"]({ json })

      if (!response.ok) {
        throw new Error("로그인에 실패했습니다.")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("로그인에 성공했습니다.")
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["current"] })
    },
    onError: (error) => {
      toast.error("로그인에 실패했습니다.")
    }
  })

  return mutation
}
