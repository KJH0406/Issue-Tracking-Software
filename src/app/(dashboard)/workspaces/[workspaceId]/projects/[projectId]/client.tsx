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

export const ProjectIdClient = () => {
  // 프로젝트 ID 가져오기
  const projectId = useProjectId()

  // 프로젝트 가져오기
  const { data, isLoading } = useGetProject({ projectId })

  if (isLoading) {
    return <PageLoader />
  }

  if (!data) {
    return <PageError message="프로젝트를 찾을 수 없습니다." />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectThumbnail
            name={data.name}
            image={data.imageUrl}
            className="size-8"
          />
          <p className="text-xl font-semibold">{data.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              // 프로젝트 설정 페이지로 이동
              href={`/workspaces/${data.workspaceId}/projects/${data.$id}/settings`}
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
