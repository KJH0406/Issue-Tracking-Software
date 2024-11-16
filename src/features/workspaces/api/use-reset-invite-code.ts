// 외부 라이브러리 임포트
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

// 내부 모듈 임포트
import { client } from "@/lib/rpc"

// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>

// 워크스페이스 초대 코드 재설정 훅
export const useResetInviteCode = () => {
  // 쿼리 클라이언트 가져오기
  const queryClient = useQueryClient()

  // 워크스페이스 초대 코드 재설정 뮤테이션
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      // 워크스페이스 초대 코드 재설정 API 호출
      const response = await client.api.workspaces[":workspaceId"][
        "reset-invite-code"
      ]["$post"]({
        param,
      })

      if (!response.ok) {
        throw new Error("워크스페이스 초대 코드 재설정에 실패했습니다.")
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      // 워크스페이스 초대 코드 재설정 성공
      toast.success("워크스페이스 초대 코드가 재설정되었습니다.")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] })
    },
    onError: () => {
      // 워크스페이스 초대 코드 재설정 실패
      toast.error("워크스페이스 초대 코드 재설정에 실패했습니다.")
    },
  })

  return mutation
}
