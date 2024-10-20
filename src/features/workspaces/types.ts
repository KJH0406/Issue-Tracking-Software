import { Models } from "node-appwrite"

// 워크스페이스 타입
export type Workspace = Models.Document & {
  name: string
  imageUrl: string
  inviteCode: string
  userId: string
}
