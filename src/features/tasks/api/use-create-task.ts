import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { toast } from "sonner"

import { client } from "@/lib/rpc"

// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>
type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>

// 일감 생성 훅
export const useCreateTask = () => {
  // 쿼리 클라이언트 가져오기
  const queryClient = useQueryClient()

  // 일감 생성 뮤테이션
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      // 일감 생성 API 호출
      const response = await client.api.tasks["$post"]({ json })

      if (!response.ok) {
        throw new Error("일감 생성에 실패했습니다.")
      }

      return await response.json()
    },
    onSuccess: () => {
      // 일감 생성 성공
      toast.success("일감이 생성되었습니다.")

      queryClient.invalidateQueries({ queryKey: ["project-analytics"] })
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] })
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: () => {
      // 일감 생성 실패
      toast.error("일감 생성에 실패했습니다.")
    },
  })

  return mutation
}
