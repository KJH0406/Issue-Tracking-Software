import { getCurrent } from "@/features/auth/queries"
import { redirect } from "next/navigation"
import { WorkspaceIdJoinClient } from "./clinet"

// 워크스페이스 참여 페이지
const WorkspaceIdJoinPage = async () => {
  const user = await getCurrent()
  if (!user) {
    return redirect("/sign-in")
  }

  return <WorkspaceIdJoinClient />
}

export default WorkspaceIdJoinPage
