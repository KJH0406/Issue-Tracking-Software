import { redirect } from "next/navigation"
import { getCurrent } from "@/features/auth/queries"

// 워크스페이스 페이지
const WorkspacePage = async () => {
  const user = await getCurrent()
  if (!user) {
    redirect("/sign-in")
  }
  return <div>WorkspacePage</div>
}

export default WorkspacePage
