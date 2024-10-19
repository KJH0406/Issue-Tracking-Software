import { z } from "zod"

// 워크스페이스 생성
export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"), 
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === "" ? undefined : value),
  ])
  .optional(),
})

