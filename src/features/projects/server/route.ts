import { z } from "zod"
import { Hono } from "hono"
import { Query } from "node-appwrite"
import { zValidator } from "@hono/zod-validator"

import { getMember } from "@/features/members/utils"

import { sessionMiddleware } from "@/lib/session-middleware"
import { DATABASE_ID, PROJECTS_ID } from "@/config"

const app = new Hono()

  // 공간의 프로젝트 목록 가져오기
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      // 현재 세션의 유저 정보와 Appwrite 데이터베이스 가져오기
      const user = c.get("user")
      const databases = c.get("databases")

      // 요청 쿼리에서 workspaceId 가져오기
      const { workspaceId } = c.req.valid("query")

      if (!workspaceId) {
        return c.json({ error: "workspaceId is required" }, 400)
      }

      // 현재 사용자가 해당 워크스페이스의 멤버인지 확인
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      // 멤버가 아니면 401 Unauthorized 응답
      if (!member) {
        return c.json({ error: "unauthorized" }, 401)
      }

      // 해당 워크스페이스의 프로젝트 목록 조회
      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId), // workspaceId로 필터링
        Query.orderDesc("$createdAt"), // 생성일 기준 내림차순 정렬
      ])

      // 조회된 프로젝트 목록 반환
      return c.json({ data: projects })
    }
  )

export default app
