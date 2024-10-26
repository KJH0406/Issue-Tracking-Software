import { Models } from "node-appwrite"

// 프로젝트 타입
export type Project = Models.Document & {
  name: string
  imageUrl: string
  workspaceId: string
}
