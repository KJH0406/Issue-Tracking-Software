"use client"

import { Analytics } from "@/components/analytics"
import { DottedSeparator } from "@/components/dotted-separator"
import { PageError } from "@/components/page-error"
import { PageLoader } from "@/components/page-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { MemberThumbnail } from "@/features/members/components/member-thumbnail"
import { Member } from "@/features/members/types"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { ProjectThumbnail } from "@/features/projects/components/project-thumbnail"
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project.modal"
import { Project } from "@/features/projects/types"
import { useGetTasks } from "@/features/tasks/api/use-get-tasks"
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task.modal"
import { Task } from "@/features/tasks/types"
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"

export const WorkspaceIdClient = () => {
  // 워크스페이스 ID
  const workspaceId = useWorkspaceId()
  // 워크스페이스 분석
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({
      workspaceId,
    })
  // 일감
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  })
  // 프로젝트
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  })
  // 멤버
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  })

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers

  // 워크스페이스 불러오기 로딩
  if (isLoading) {
    return <PageLoader />
  }

  // 워크스페이스 불러오기 실패
  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="워크스페이스를 불러오는 데 실패했습니다." />
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MemberList data={members.documents} total={members.total} />
      </div>
    </div>
  )
}

interface TaskListProps {
  data: Task[]
  total: number
}

// 일감 리스트
export const TaskList = ({ data, total }: TaskListProps) => {
  // 워크스페이스 ID
  const workspaceId = useWorkspaceId()
  const { open: createTask } = useCreateTaskModal()
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">일감 ({total})</p>
          <Button variant="muted" size="icon" onClick={createTask}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75  transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p className="text-sm text-neutral-500">
                        {task.project?.name}
                      </p>
                      <div className="size-1 bg-neutral-300 rounded-full" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-small text-muted-foreground text-center hidden first-of-type:block">
            생성된 일감이 없습니다.
          </li>
        </ul>
        <Button variant="muted" className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>모든 일감 보기</Link>
        </Button>
      </div>
    </div>
  )
}

interface ProjectListProps {
  data: Project[]
  total: number
}

// 프로젝트 리스트
export const ProjectList = ({ data, total }: ProjectListProps) => {
  // 워크스페이스 ID
  const workspaceId = useWorkspaceId()
  const { open: createProject } = useCreateProjectModal()
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">프로젝트 ({total})</p>
          <Button variant="secondary" size="icon" onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75  transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectThumbnail
                      className="size-12"
                      fallbackClassName="text-lg"
                      name={project.name}
                      image={project.imageUrl}
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-small text-muted-foreground text-center hidden first-of-type:block">
            생성된 프로젝트가 없습니다.
          </li>
        </ul>
      </div>
    </div>
  )
}

interface MemberListProps {
  data: Member[]
  total: number
}

// 사용자 리스트
export const MemberList = ({ data, total }: MemberListProps) => {
  // 워크스페이스 ID
  const workspaceId = useWorkspaceId()
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">사용자 ({total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberThumbnail
                    className="size-12"
                    fallbackClassName="text-lg"
                    name={member.name}
                  />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-small text-muted-foreground text-center hidden first-of-type:block">
            생성된 사용자가 없습니다.
          </li>
        </ul>
      </div>
    </div>
  )
}
