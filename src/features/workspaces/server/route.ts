import { Hono } from "hono"
import { ID, Query } from "node-appwrite"
import { zValidator } from "@hono/zod-validator"

import { sessionMiddleware } from "@/lib/session-middleware"
import { generateInviteCode } from "@/lib/utils"

import {
  DATABASE_ID,
  WORKSPACE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
} from "@/config"

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas"
import { MemberRole } from "@/features/members/types"
import { getMember } from "@/features/members/utils"

const app = new Hono()

  // 워크스페이스 목록 가져오기
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user") // 전체 사용자 가져오기
    const databases = c.get("databases") // 데이터베이스 가져오기

    // 워크스페이스 멤버 가져오기
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      // 사용자 ID가 일치하는 멤버 가져오기
      Query.equal("userId", user.$id),
    ])

    // 멤버가 없으면 워크스페이스 생성 페이지로 이동
    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } })
    }

    // 워크스페이스 ID 가져오기
    const workspaceIds = members.documents.map((member) => member.workspaceId)

    // 워크스페이스 가져오기
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [
        // 워크스페이스 ID가 일치하는 워크스페이스 가져오기
        Query.orderDesc("$createdAt"),
        Query.contains("$id", workspaceIds),
      ]
    )

    return c.json({ data: workspaces })
  })

  // 워크스페이스 생성
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    // 세션 가져오기
    sessionMiddleware,

    async (c) => {
      const databases = c.get("databases") // 데이터베이스 가져오기
      const storage = c.get("storage") // 스토리지 가져오기
      const user = c.get("user") // 사용자 가져오기

      const { name, image } = c.req.valid("form") // 폼 데이터 가져오기

      // 업로드된 이미지의 URL을 저장할 변수 초기화
      let uploadedImageUrl: string | undefined

      // 이미지가 제공되었는지 확인
      if (image instanceof File) {
        // 스토리지에 이미지 파일 업로드
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        )

        // 업로드된 이미지의 미리보기 가져오기
        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        )

        // ArrayBuffer를 Base64 문자열로 변환하여 데이터 URL 생성
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`
      }

      // 데이터베이스에 새 워크스페이스 문서 생성
      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        ID.unique(),
        {
          name, // 워크스페이스 이름
          userId: user.$id, // 사용자 ID
          imageUrl: uploadedImageUrl, // 업로드된 이미지 URL (이미지가 없으면 undefined)
          inviteCode: generateInviteCode(6), // 초대 코드 생성(최대 길이 10)
        }
      )

      // 워크스페이스 생성 시 관리자 자동 생성
      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      })

      // 워크스페이스 생성 성공
      return c.json({ data: workspace })
    }
  )

  // 워크스페이스 업데이트
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema), // 유효성 검사
    sessionMiddleware,
    async (c) => {
      // appwrite db에서 정보 가져오기
      const databases = c.get("databases") // 데이터베이스 가져오기
      const storage = c.get("storage") // 스토리지 가져오기
      const user = c.get("user") // 사용자 가져오기

      // URL 파라미터에서 워크스페이스 ID 추출
      const { workspaceId } = c.req.param()
      // 유효성 검사를 통과한 폼 데이터 가져오기
      const { name, image } = c.req.valid("form")

      // 현재 사용자 멤버 가져오기(멤버가 없거나 관리자가 아니면 401 Unauthorized 오류를 반환)
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      // 멤버가 없거나 멤버의 권한이 관리자가 아니면 권한 없음 반환
      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      // 업로드된 이미지의 URL을 저장할 변수 초기화
      let uploadedImageUrl: string | undefined

      // 이미지가 제공되었는지 확인
      if (image instanceof File) {
        // 스토리지에 이미지 파일 업로드
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        )

        // 업로드된 이미지의 미리보기 가져오기
        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        )

        // ArrayBuffer를 Base64 문자열로 변환하여 데이터 URL 생성
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`
      } else {
        uploadedImageUrl = image
      }

      // 수정된 정보로 워크스페이스 업데이트 실행
      const updatedWorkspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId,
        { name, imageUrl: uploadedImageUrl }
      )

      return c.json({ data: updatedWorkspace })
    }
  )

  // 워크스페이스 삭제
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases") // 데이터베이스 가져오기
    const user = c.get("user") // 사용자 가져오기

    const { workspaceId } = c.req.param() // URL 파라미터에서 워크스페이스 ID 추출

    // 현재 사용자 멤버 가져오기
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    // 멤버가 없거나 멤버의 권한이 관리자가 아니면 권한 없음 반환
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    // 워크스페이스 삭제 실행
    await databases.deleteDocument(DATABASE_ID, WORKSPACE_ID, workspaceId)

    return c.json({ data: { $id: workspaceId } })
  })

  // 워크스페이스 초대 코드 재설정
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases") // 데이터베이스 가져오기
    const user = c.get("user") // 사용자 가져오기

    const { workspaceId } = c.req.param() // URL 파라미터에서 워크스페이스 ID 추출

    // 현재 사용자 멤버 가져오기
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    // 멤버가 없거나 멤버의 권한이 관리자가 아니면 권한 없음 반환
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    // 워크스페이스 초대 코드 재설정 실행
    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(6),
      }
    )

    return c.json({ data: workspace })
  })

export default app
