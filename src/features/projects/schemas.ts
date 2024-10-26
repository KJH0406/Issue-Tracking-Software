import { z } from "zod"

// 프로젝트 생성
export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  // 워크스페이스 ID
  workspaceId: z.string(),
})
