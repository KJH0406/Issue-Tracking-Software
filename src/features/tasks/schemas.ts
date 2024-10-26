import { z } from "zod"
import { TaskStatus } from "./types"

// 일감 생성 스키마
export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "제목은 필수입니다."),
  status: z.nativeEnum(TaskStatus, {
    required_error: "상태는 필수입니다.",
  }),
  workspaceId: z.string().trim().min(1, "워크스페이스는 필수입니다."),
  projectId: z.string().trim().min(1, "프로젝트는 필수입니다."),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "담당자는 필수입니다."),
  description: z.string().optional(),
})
