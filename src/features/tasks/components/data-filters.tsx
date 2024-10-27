import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react"

import { TaskStatus } from "../types"

import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useGetMembers } from "@/features/members/api/use-get-members"

import { DatePicker } from "@/components/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTaskFilters } from "../hooks/use-task-filters"

interface DataFiltersProps {
  hideProjectFilter?: boolean
}

// 일감 데이터 필터 컴포넌트(프로젝트 별)
export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  // 현재 작업 공간의 ID를 가져오기
  const workspaceId = useWorkspaceId()

  // 현재 작업 공간의 프로젝트 목록을 가져오기
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  })

  // 현재 작업 공간의 멤버 목록을 가져오기
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  })

  // 프로젝트 목록과 멤버 목록 로딩 상태 체크
  const isLoading = isLoadingProjects || isLoadingMembers

  // 프로젝트 목록 옵션 생성
  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }))

  // 멤버 목록 옵션 생성
  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }))

  // 일감 필터 상태 관리
  const [{ status, projectId, assigneeId, dueDate }, setFilters] =
    useTaskFilters()

  // 일감 상태 변경 핸들러
  const onStatusChange = (value: string) => {
    // 모든 상태인 경우 필터 상태 초기화
    if (value === "all") {
      setFilters({ status: null })
    } else {
      // 선택한 상태로 필터 상태 업데이트
      setFilters({ status: value as TaskStatus })
    }
  }

  // 일감 담당자 변경 핸들러
  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) })
  }

  // 일감 프로젝트 변경 핸들러
  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) })
  }

  // 로딩 중인 경우 아무것도 렌더링하지 않기
  if (isLoading) {
    return null
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2 ">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="모든 상태" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 상태</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>대기</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>진행</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>검토</SelectItem>
          <SelectItem value={TaskStatus.DONE}>완료</SelectItem>
          <SelectItem value={TaskStatus.CANCELLED}>취소</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="모든 담당자" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 담당자</SelectItem>
          <SelectSeparator />
          {/* 멤버 선택 가능 목록 */}
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={(value) => onProjectChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <FolderIcon className="size-4 mr-2" />
            <SelectValue placeholder="모든 프로젝트" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 프로젝트</SelectItem>
          <SelectSeparator />
          {/* 프로젝트 선택 가능 목록 */}
          {projectOptions?.map((project) => (
            <SelectItem key={project.value} value={project.value}>
              {project.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        placeholder="마감일"
        className="h-8 w-full lg:w-auto"
        // 마감일 선택 상태 관리
        value={dueDate ? new Date(dueDate) : undefined}
        // 마감일 선택 변경 핸들러
        onChange={(date) =>
          setFilters({ dueDate: date?.toISOString() ?? null })
        }
      />
    </div>
  )
}
