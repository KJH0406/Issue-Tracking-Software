import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"

import { WorkspaceIdSettingsClient } from "./client"

// 워크스페이스 설정 페이지 컴포넌트
const WorkspaceIdSettingsPage = async () => {
  // 현재 로그인한 사용자 정보
  const user = await getCurrent()

  // 사용자 정보가 없으면 (로그인하지 않은 경우) 로그인 페이지로 리다이렉트
  if (!user) {
    redirect("/sign-in")
  }

  // 모든 조건을 통과하면 워크스페이스 업데이트 폼 렌더링
  return <WorkspaceIdSettingsClient />
}

export default WorkspaceIdSettingsPage
