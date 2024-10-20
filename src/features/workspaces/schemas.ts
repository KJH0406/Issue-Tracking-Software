import { z } from "zod"

// 워크스페이스 생성
export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
})

// 워크스페이스 업데이트
export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "최소 1자 이상 변경해주세요.").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
})
