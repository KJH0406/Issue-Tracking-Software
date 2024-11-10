import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { toast } from "sonner"

import { client } from "@/lib/rpc"

// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>

// 일감 업데이트 훅
export const useUpdateTask = () => {
  // 쿼리 클라이언트 가져오기
  const queryClient = useQueryClient()

  // 일감 업데이트 뮤테이션
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      // 일감 업데이트 API 호출
      const response = await client.api.tasks[":taskId"]["$patch"]({
        json,
        param,
      })

      if (!response.ok) {
        throw new Error("일감 업데이트에 실패했습니다.")
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      // 일감 업데이트 성공
      toast.success("일감이 업데이트되었습니다.")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] })
    },
    onError: (error) => {
      // 일감 업데이트 실패
      toast.error("일감 업데이트에 실패했습니다.")
    },
  })

  return mutation
}
