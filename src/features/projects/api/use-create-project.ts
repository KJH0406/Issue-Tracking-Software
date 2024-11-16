import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { toast } from "sonner"

import { client } from "@/lib/rpc"

// API의 응답과 요청 타입을 추론
type ResponseType = InferResponseType<
  (typeof client.api.projects)["$post"],
  200
>
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>

// 프로젝트 생성 훅
export const useCreateProject = () => {
  // 쿼리 클라이언트 가져오기
  const queryClient = useQueryClient()

  // 프로젝트 생성 뮤테이션
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      // 프로젝트 생성 API 호출
      const response = await client.api.projects["$post"]({ form })

      if (!response.ok) {
        throw new Error("프로젝트 생성에 실패했습니다.")
      }

      return await response.json()
    },
    onSuccess: () => {
      // 프로젝트 생성 성공
      toast.success("프로젝트가 생성되었습니다.")
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: () => {
      // 프로젝트 생성 실패
      toast.error("프로젝트 생성에 실패했습니다.")
    },
  })

  return mutation
}
