import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { toast } from "sonner"

import { client } from "@/lib/rpc"

// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>

// 워크스페이스 참여 훅
export const useJoinWorkspace = () => {
  // 쿼리 클라이언트 가져오기
  const queryClient = useQueryClient()

  // 워크스페이스 참여 뮤테이션
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      // 워크스페이스 참여 API 호출
      const response = await client.api.workspaces[":workspaceId"]["join"][
        "$post"
      ]({
        param,
        json,
      })

      if (!response.ok) {
        throw new Error("워크스페이스 참여에 실패했습니다.")
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      // 워크스페이스 참여 성공
      toast.success("워크스페이스 참여에 성공했습니다.")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] })
    },
    onError: () => {
      // 워크스페이스 참여 실패
      toast.error("워크스페이스 참여에 실패했습니다.")
    },
  })

  return mutation
}
