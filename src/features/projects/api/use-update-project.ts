// 외부 라이브러리 임포트
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { useRouter } from "next/navigation"

// 토스트 알림 라이브러리 임포트
import { toast } from "sonner"

// API 클라이언트 임포트
import { client } from "@/lib/rpc"

// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>

// 프로젝트 업데이트 훅
export const useUpdateProject = () => {
  const router = useRouter()
  // 쿼리 클라이언트 가져오기
  const queryClient = useQueryClient()

  // 프로젝트 업데이트 뮤테이션
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      // 프로젝트 업데이트 API 호출
      const response = await client.api.projects[":projectId"]["$patch"]({
        form,
        param,
      })

      if (!response.ok) {
        throw new Error("프로젝트 업데이트에 실패했습니다.")
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      // 프로젝트 업데이트 성공
      toast.success("프로젝트가 업데이트되었습니다.")
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] })
    },
    onError: (error) => {
      // 프로젝트 업데이트 실패
      toast.error("프로젝트 업데이트에 실패했습니다.")
    },
  })

  return mutation
}
