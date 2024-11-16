import { redirect } from "next/navigation"
import { getCurrent } from "@/features/auth/queries"
import { WorkspaceIdClient } from "./client"

// 워크스페이스 페이지
const WorkspacePage = async () => {
  const user = await getCurrent()
  if (!user) {
    redirect("/sign-in")
  }
  return <WorkspaceIdClient />
}

export default WorkspacePage
