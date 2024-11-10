import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { toast } from "sonner"

import { client } from "@/lib/rpc"

// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>

// 일감 삭제 훅
export const useDeleteTask = () => {
  // 쿼리 클라이언트 가져오기
  const queryClient = useQueryClient()

  // 일감 삭제 뮤테이션
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      // 일감 삭제 API 호출
      const response = await client.api.tasks[":taskId"]["$delete"]({ param })

      if (!response.ok) {
        throw new Error("일감 삭제에 실패했습니다.")
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      // 일감 삭제 성공
      toast.success("일감이 삭제되었습니다.")
      queryClient.invalidateQueries({ queryKey: ["tasks"] }) // 일감 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] }) // 삭제한 일감 쿼리 무효화
    },
    onError: (error) => {
      // 일감 삭제 실패
      toast.error("일감 삭제에 실패했습니다.")
    },
  })

  return mutation
}
