"use client"

import Link from "next/link"

// UI 아이콘 임포트
import { PencilIcon } from "lucide-react"

// 프로젝트 관련 컴포넌트 임포트
import { ProjectThumbnail } from "@/features/projects/components/project-thumbnail"
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher"

// UI 컴포넌트 임포트
import { Button } from "@/components/ui/button"
import { PageLoader } from "@/components/page-loader"
import { PageError } from "@/components/page-error"

// 프로젝트 관련 훅 임포트
import { useProjectId } from "@/features/projects/hooks/use-project-id"
import { useGetProject } from "@/features/projects/api/use-get-project"
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics"
import { Analytics } from "@/components/analytics"

export const ProjectIdClient = () => {
  // 프로젝트 ID 가져오기
  const projectId = useProjectId()

  // 프로젝트 가져오기
  const { data: project, isLoading: isProjectLoading } = useGetProject({
    projectId,
  })
  // 프로젝트 분석 가져오기
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetProjectAnalytics({ projectId })

  if (isProjectLoading || isAnalyticsLoading) {
    return <PageLoader />
  }

  if (!project) {
    return <PageError message="프로젝트를 찾을 수 없습니다." />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectThumbnail
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-xl font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              // 프로젝트 설정 페이지로 이동
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              프로젝트 설정
            </Link>
          </Button>
        </div>
      </div>
      {analytics ? <Analytics data={analytics} /> : null}
      <TaskViewSwitcher />
    </div>
  )
}
