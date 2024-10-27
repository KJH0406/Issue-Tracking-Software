import { useQueryStates, parseAsString, parseAsStringEnum } from "nuqs"

import { TaskStatus } from "../types"

// 일감 필터 훅
// URL 쿼리 파라미터를 활용하여 일감 상태 관리(공유 및 즐겨찾기 가능)
export const useTaskFilters = () => {
  // 일감 필터 상태 관리
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  })
}
