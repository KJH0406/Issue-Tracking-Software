import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/actions"
import { getWorkspace } from "@/features/workspaces/actions"

import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form"

// 워크스페이스 설정 페이지 타입 정의
interface WorkspaceIdSettingsPageProps {
  params: {
    workspaceId: string // URL에서 추출된 워크스페이스 ID
  }
}

// 워크스페이스 설정 페이지 컴포넌트
const WorkspaceIdSettingsPage = async ({
  params,
}: WorkspaceIdSettingsPageProps) => {
  // 현재 로그인한 사용자 정보
  const user = await getCurrent()

  // URL에서 추출한 워크스페이스 ID를 사용하여 해당 워크스페이스 정보 가져오기
  const initialValues = await getWorkspace({ workspaceId: params.workspaceId })

  // 워크스페이스 정보가 없으면 해당 워크스페이스의 메인 페이지로 리다이렉트
  if (!initialValues) {
    redirect(`/workspaces/${params.workspaceId}`)
  }

  // 사용자 정보가 없으면 (로그인하지 않은 경우) 로그인 페이지로 리다이렉트
  if (!user) {
    redirect("/sign-in")
  }

  // 모든 조건을 통과하면 워크스페이스 업데이트 폼 렌더링
  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm initialValues={initialValues} />
    </div>
  )
}

export default WorkspaceIdSettingsPage
