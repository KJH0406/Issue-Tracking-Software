// 외부 라이브러리 및 컴포넌트 임포트
import Link from "next/link"
import { redirect } from "next/navigation"
import { PencilIcon } from "lucide-react"

// UI 컴포넌트 임포트
import { Button } from "@/components/ui/button"

// 기능 관련 임포트
import { getCurrent } from "@/features/auth/queries"
import { getProject } from "@/features/projects/queries"
import { ProjectThumbnail } from "@/features/projects/components/project-thumbnail"
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher"
interface ProjectIdPageProps {
  params: {
    projectId: string
  }
}

// 프로젝트 페이지
const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  // 현재 유저 조회
  const user = await getCurrent()
  if (!user) {
    redirect("/sign-in")
  }

  const initialValues = await getProject({ projectId: params.projectId })

  if (!initialValues) {
    throw new Error("Project not found")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectThumbnail
            name={initialValues.name}
            image={initialValues.imageUrl}
            className="size-8"
          />
          <p className="text-xl font-semibold">{initialValues.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              // 프로젝트 설정 페이지로 이동
              href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              프로젝트 설정
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  )
}

export default ProjectIdPage
