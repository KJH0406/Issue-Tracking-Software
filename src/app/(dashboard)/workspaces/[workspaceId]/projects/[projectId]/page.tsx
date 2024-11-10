// 외부 라이브러리 및 컴포넌트 임포트
import { redirect } from "next/navigation"

// 기능 관련 임포트
import { getCurrent } from "@/features/auth/queries"
import { ProjectIdClient } from "./client"

// 프로젝트 페이지
const ProjectIdPage = async () => {
  // 현재 유저 조회
  const user = await getCurrent()
  if (!user) {
    redirect("/sign-in")
  }

  return <ProjectIdClient />
}

export default ProjectIdPage
