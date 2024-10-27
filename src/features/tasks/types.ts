import { Models } from "node-appwrite"

// 일감 상태 데이터 타입
export enum TaskStatus {
  BACKLOG = "BACKLOG",
  CANCELLED = "CANCELLED",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

// 일감 데이터 타입
export type Task = Models.Document & {
  name: string
  status: TaskStatus
  workspaceId: string
  assigneeId: string
  projectId: string
  position: number
  dueDate: string
}
