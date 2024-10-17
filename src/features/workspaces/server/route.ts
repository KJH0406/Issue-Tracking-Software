import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { createWorkspaceSchema } from "../schemas";

import { sessionMiddleware } from "@/lib/session-middleware";
import { ID } from "node-appwrite";

import { DATABASE_ID, WORKSPACE_ID } from "@/config";

// 라우트 생성
const app = new Hono()

// 라우트 추가
.post(
    "/",
    zValidator("json", createWorkspaceSchema),
    // 세션 가져오기
    sessionMiddleware,

    // 데이터베이스 가져오기
    async (c) => {
      const databases = c.get("databases")
      const user = c.get("user")
      
      const { name } = await c.req.json()

      // 데이터베이스에 워크스페이스 생성
      const workspace = await databases.createDocument(DATABASE_ID, WORKSPACE_ID, ID.unique(), {
        name,
        userId: user.$id
      })

      // 워크스페이스 생성 성공
      return c.json({data: workspace})
    }
  )

// 라우트 내보내기
export default app