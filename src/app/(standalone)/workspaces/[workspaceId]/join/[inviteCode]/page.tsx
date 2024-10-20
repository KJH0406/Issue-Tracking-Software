import { getCurrent } from "@/features/auth/queries"
import { redirect } from "next/navigation"

import { getWorkspaceInfo } from "@/features/workspaces/queries"
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form"

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string
    inviteCode: string
  }
}

// 워크스페이스 참여 페이지
const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await getCurrent()
  if (!user) {
    return redirect("/sign-in")
  }

  // 워크스페이스 정보 가져오기
  const initialValues = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  })

  // 워크스페이스 정보가 없으면 리다이렉트
  if (!initialValues) {
    return redirect("/")
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  )
}

export default WorkspaceIdJoinPage
