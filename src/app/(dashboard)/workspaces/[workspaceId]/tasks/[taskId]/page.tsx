import { getCurrent } from "@/features/auth/queries"
import { redirect } from "next/navigation"
import { TaskIdClient } from "./client"

const TaskPage = async () => {
  // 현재 사용자 가져오기
  const user = await getCurrent()

  // 사용자가 없으면 로그인 페이지로 리다이렉트
  if (!user) redirect("/sign-in")

  return <TaskIdClient />
}

export default TaskPage
