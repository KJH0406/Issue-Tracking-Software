import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/actions"
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form"
export default async function Home() {
  const user = await getCurrent() // 현재 로그인한 사용자 정보 가져오기

  if (!user) {
    // 로그인 하지 않은 경우 로그인 페이지로 리다이렉트
    redirect("/sign-in")
  }
  return (
    <div className="bg-neutral-500 p-4 h-full">
      <CreateWorkspaceForm />
    </div>
  )
}
