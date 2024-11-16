import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { client } from "@/lib/rpc"
import { toast } from "sonner"
// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>
type RequestType = InferRequestType<(typeof client.api.auth.register)["$post"]>

export const useRegister = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register["$post"]({ json })

      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.")
      }
      return await response.json()
    },
    onSuccess: () => {
      toast.success("회원가입에 성공했습니다.")
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["current"] })
    },
    onError: () => {
      toast.error("회원가입에 실패했습니다.")
    },
  })

  return mutation
}
