import { z } from "zod"

// 프로젝트 생성
export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "최소 1자 이상 입력해주세요."),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  // 워크스페이스 ID
  workspaceId: z.string(),
})

// 프로젝트 업데이트(설정 페이지)
export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "최소 1자 이상 입력해주세요.").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
})
