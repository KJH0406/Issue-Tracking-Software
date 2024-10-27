import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

import { TaskStatus } from "../types"

interface UseGetTasksProps {
  workspaceId: string
  projectId?: string | null
  status?: TaskStatus | null
  search?: string | null
  assigneeId?: string | null
  dueDate?: string | null
}

// 일감 목록 가져오기
export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  assigneeId,
  dueDate,
  search,
}: UseGetTasksProps) => {
  // 사용자 인증 상태 조회
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      assigneeId,
      dueDate,
      search,
    ],
    queryFn: async () => {
      // 서버에서 일감 목록 가져오기
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          search: search ?? undefined,
        },
      })

      // 서버 응답 실패 처리
      if (!response.ok) {
        throw new Error("일감 목록 가져오기 실패")
      }

      // 일감 목록 JSON으로 파싱
      const { data } = await response.json()
      return data
    },
  })

  // 쿼리 결과 반환
  return query
}
