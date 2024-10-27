"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Task, TaskStatus } from "../types"
import { ProjectThumbnail } from "@/features/projects/components/project-thumbnail"
import { MemberThumbnail } from "@/features/members/components/member-thumbnail"
import { TaskDate } from "./task-date"
import { TaskStatusBadge } from "./task-status-badge"
import { TaskActions } from "./task-actions"

// 일감 테이블 컬럼 정의
export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          일감 이름
          <ArrowUpDown className="size-4 ml-2" />
        </Button>
      )
    },

    cell: ({ row }) => {
      const name = row.original.name
      return <p className="line-clamp-1">{name}</p>
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          프로젝트
          <ArrowUpDown className="size-4 ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const project = row.original.project
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectThumbnail
            className="size-6"
            name={project.name}
            image={project.imageUrl}
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          담당자
          <ArrowUpDown className="size-4 ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberThumbnail
            className="size-6"
            fallbackClassName="text-sm"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          마감일
          <ArrowUpDown className="size-4 ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate
      return <TaskDate value={dueDate} />
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          상태
          <ArrowUpDown className="size-4 ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.original.status
      return <TaskStatusBadge status={status} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id
      const projectId = row.original.project.id
      return (
        <TaskActions id={id} projectId={projectId}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      )
    },
  },
]
