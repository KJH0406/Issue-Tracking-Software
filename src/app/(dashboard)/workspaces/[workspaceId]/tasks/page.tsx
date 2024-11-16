import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher"

// 내 페이지 일감 목록
const TasksPage = async () => {
  // 현재 사용자 가져오기
  const currentUser = await getCurrent()

  // 사용자가 없으면 로그인 페이지로 리다이렉트
  if (!currentUser) redirect("/sign-in")

  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  )
}

export default TasksPage
