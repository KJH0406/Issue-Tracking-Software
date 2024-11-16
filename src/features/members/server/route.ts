import { z } from "zod"
import { Hono } from "hono"
import { Query } from "node-appwrite"
import { zValidator } from "@hono/zod-validator"

import { createAdminClient } from "@/lib/appwrite"
import { DATABASE_ID, WORKSPACE_ID, MEMBERS_ID } from "@/config"
import { sessionMiddleware } from "@/lib/session-middleware"

import { getMember } from "../utils"
import { Member, MemberRole } from "../types"

// 워크스페이스의 모든 멤버 목록을 가져옴
const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient()
      const databases = c.get("databases")
      const user = c.get("user")
      const { workspaceId } = c.req.valid("query")

      // 현재 사용자의 멤버 정보를 가져오기
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      // 멤버가 없으면 권한 없음 오류를 반환
      if (!member) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        )
      }

      // 워크스페이스의 모든 멤버를 가져오기
      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", workspaceId)]
      )

      // 각 멤버의 상세 정보를 가져와서 추가
      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId)

          return {
            ...member,
            name: user.name,
            email: user.email,
          }
        })
      )

      // 결과를 JSON 형식으로 반환
      return c.json({
        data: { ...members, documents: populatedMembers },
      })
    }
  )

  // 멤버 삭제
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param()
    const user = c.get("user")
    const databases = c.get("databases")

    // 삭제할 멤버 정보
    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    )

    // 해당 워크스페이스의 모든 멤버를 가져오기
    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    )

    // 현재 사용자의 멤버 정보 가져오기
    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    })

    // 권한 검사
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    // 삭제하려는 멤버가 현재 사용자가 아니고 관리자가 아니면 권한 없음 오류 반환
    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    // 마지막 멤버는 삭제할 수 없음
    if (allMembersInWorkspace.total === 1) {
      return c.json({ error: "Cannot delete last member" }, 400)
    }

    // 멤버 삭제
    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId)

    // 삭제된 멤버의 ID 반환
    return c.json({ data: { $id: memberToDelete.$id } })
  })

  // 멤버 역할 업데이트
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      // 필요한 데이터를 가져오기
      const { memberId } = c.req.param()
      const user = c.get("user")
      const databases = c.get("databases")
      const { role } = c.req.valid("json")

      // 업데이트할 멤버 정보 가져오기
      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      )

      // 해당 워크스페이스의 모든 멤버 가져오기
      const allMembersInWorkspace = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      )

      // 현재 사용자의 멤버 정보 가져오기
      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      })

      // 권한 검사
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      // 관리자만 역할을 변경할 수 있음
      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      // 마지막 관리자는 역할을 변경할 수 없음
      if (allMembersInWorkspace.total === 1) {
        return c.json({ error: "Cannot downgrade last admin" }, 400)
      }

      // 멤버의 역할 업데이트
      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      })

      // 업데이트된 멤버의 ID 반환
      return c.json({ data: { $id: memberToUpdate.$id } })
    }
  )

export default app

// GET 라우트 ("/"):
// 워크스페이스의 모든 멤버 목록을 가져옴
// 각 멤버의 상세 정보(이름, 이메일)를 추가로 가져와 반환

// DELETE 라우트 ("/:memberId"):
// 특정 멤버를 삭제
// 권한 검사를 수행하여 관리자나 본인만 삭제할 수 있도록 함
// 마지막 멤버는 삭제할 수 없도록 함

// PATCH 라우트 ("/:memberId"):
// 멤버의 역할을 업데이트
// 관리자만 다른 멤버의 역할을 변경할 수 있음
// 마지막 관리자의 역할은 변경할 수 없음
