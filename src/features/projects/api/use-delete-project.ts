import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { toast } from "sonner"

import { client } from "@/lib/rpc"
import { useRouter } from "next/navigation"

// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>

// 프로젝트 삭제 훅
export const useDeleteProject = () => {
  const router = useRouter()
  // 쿼리 클라이언트 가져오기
  const queryClient = useQueryClient()

  // 프로젝트 삭제 뮤테이션
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      // 프로젝트 삭제 API 호출
      const response = await client.api.projects[":projectId"]["$delete"]({
        param,
      })

      if (!response.ok) {
        throw new Error("프로젝트 삭제에 실패했습니다.")
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      // 프로젝트 삭제 성공
      toast.success("프로젝트가 삭제되었습니다.")
      router.push("/")
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] })
    },
    onError: () => {
      // 프로젝트 삭제 실패
      toast.error("프로젝트 삭제에 실패했습니다.")
    },
  })

  return mutation
}
