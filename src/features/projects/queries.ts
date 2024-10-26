import { createSessionClient } from "@/lib/appwrite"
import { getMember } from "@/features/members/utils"
import { DATABASE_ID, PROJECTS_ID } from "@/config"
import { Project } from "@/features/projects/types"

// 프로젝트 조회를 위한 인터페이스 정의
interface GetProjectProps {
  projectId: string // 조회할 프로젝트의 고유 ID
}

// 단일 프로젝트 정보를 가져오는 비동기 함수
export const getProject = async ({ projectId }: GetProjectProps) => {
  // Appwrite 세션 클라이언트 생성 (인증 및 데이터베이스 접근을 위해)
  const { account, databases } = await createSessionClient()

  // 현재 로그인한 사용자 정보 가져오기
  const user = await account.get()

  // 프로젝트 정보를 데이터베이스에서 가져오기
  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  )

  // 현재 사용자가 프로젝트의 워크스페이스 멤버인지 확인
  const member = await getMember({
    databases,
    userId: user.$id,
    workspaceId: project.workspaceId,
  })

  // 사용자가 워크스페이스 멤버가 아니면 오류 발생 (접근 권한 없음)
  if (!member) throw new Error("Unauthorized")

  // 프로젝트 정보 반환 (접근 권한이 확인된 경우)
  return project
}
