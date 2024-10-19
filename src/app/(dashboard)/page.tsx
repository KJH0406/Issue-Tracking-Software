import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/actions"
import { getWorkspaces } from "@/features/workspaces/actions"
export default async function Home() {
  const user = await getCurrent() // 현재 로그인한 사용자 정보 가져오기

  if (!user) {
    // 로그인 하지 않은 경우 로그인 페이지로 리다이렉트
    redirect("/sign-in")
  }

  const workspaces = await getWorkspaces()

  // 워크스페이스가 없으면 워크스페이스 생성 페이지로 리다이렉트
  if (workspaces.total === 0) {
    redirect("/workspaces/create")
  } else {
    // 워크스페이스가 있으면 워크스페이스 상세 페이지로 리다이렉트
    redirect(`/workspaces/${workspaces.documents[0].$id}`)
  }
  return <div className="bg-neutral-500 p-4 h-full">홈페이지 입니다.</div>
}
