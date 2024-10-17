import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { toast } from "sonner"

import { client } from "@/lib/rpc"

// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>

// 워크스페이스 생성 훅
export const useCreateWorkspace = () => {
  // 쿼리 클라이언트 가져오기
  const queryClient = useQueryClient()

  // 워크스페이스 생성 뮤테이션
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      // 워크스페이스 생성 API 호출
      const response = await client.api.workspaces["$post"]({ json })

      if (!response.ok) {
        throw new Error("워크스페이스 생성에 실패했습니다.")
      }


      return await response.json()
    },
    onSuccess: () => {
      // 워크스페이스 생성 성공
      toast.success("워크스페이스가 생성되었습니다.")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: (error) => {
      // 워크스페이스 생성 실패
      toast.error("워크스페이스 생성에 실패했습니다.")
    }
  })

  return mutation
}
