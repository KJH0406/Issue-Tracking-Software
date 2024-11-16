import { z } from "zod"
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
  TASKS_ID,
} from "@/config"

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas"
import { MemberRole } from "@/features/members/types"
import { getMember } from "@/features/members/utils"
import { TaskStatus } from "@/features/tasks/types"
import { Workspace } from "../types"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"

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

  // 워크스페이스 단일 조회
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user")
    const databases = c.get("databases")
    const { workspaceId } = c.req.param()

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
    )

    return c.json({ data: workspace })
  })

  // 워크스페이스 정보 조히
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases")
    const { workspaceId } = c.req.param()

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
    )

    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    })
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
    zValidator("form", updateWorkspaceSchema), // 유��성 검사
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

  // 워크스페이스 참여하기
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })), // 요청 본문의 유효성을 검사하는 미들웨어
    async (c) => {
      // URL 파라미터에서 워크스페이스 ID 추출
      const { workspaceId } = c.req.param()
      // 요청 본문에서 초대 코드 추출
      const { code } = c.req.valid("json")

      // Hono 컨텍스트에서 데이터베이스와 사용자 정보 가져오기
      const databases = c.get("databases")
      const user = c.get("user")

      // 현재 사용자가 이미 워크스페이스의 멤버인지 확인
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      // 이미 워크스페이스에 참여한 경우 오류 반환
      if (member) {
        return c.json({ error: "Already joined" }, 400)
      }

      // 초대 코드가 일치하는 워크스페이스 찾기
      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId
      )

      // 초대 코드가 일치하지 않으면 오류 반환
      if (workspace?.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400)
      }

      // 새 멤버로 사용자를 워크스페이스에 추가
      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId,
        role: MemberRole.MEMBER,
      })

      // 성공적으로 참여한 워크스페이스 정보 반환
      return c.json({ data: workspace })
    }
  )

  // 워크스페이스 분석
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases")
    const user = c.get("user")

    const { workspaceId } = c.req.param()

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    const now = new Date()
    const thisMonthStart = startOfMonth(now)
    const thisMonthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    // 이번 달 작업 목록 조회
    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    )

    // 지난 달 작업 목록 조회
    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    )

    // 이번 달 작업 수
    const taskCount = thisMonthTasks.total
    // 지난 달 작업 수
    const taskDifference = taskCount - lastMonthTasks.total

    // 이번 달 할당된 작업 수
    const thisMonthAssginedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    )

    // 지난 달 할당된 작업 수
    const lastMonthAssginedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    )

    // 이번 달 할당된 작업 수
    const assignedTaskCount = thisMonthAssginedTasks.total
    // 지난 달 할당된 작업 수
    const assignedTaskDifference =
      assignedTaskCount - lastMonthAssginedTasks.total

    // 이번 달 완료되지 않은 작업 수
    const thisMonthIncompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    )

    // 지난 달 완료되지 않은 작업 수
    const lastMonthIncompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    )

    // 이번 달 완료되지 않은 작업 수
    const incompletedTaskCount = thisMonthIncompletedTasks.total
    // 지난 달 완료되지 않은 작업 수
    const incompletedTaskDifference =
      incompletedTaskCount - lastMonthIncompletedTasks.total

    // 이번 달 완료된 작업 수
    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    )

    // 지난 달 완료된 작업 수
    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    )

    // 이번 달 완료된 작업 수
    const completedTaskCount = thisMonthCompletedTasks.total
    // 지난 달 완료된 작업 수
    const completedTaskDifference =
      completedTaskCount - lastMonthCompletedTasks.total

    // 이번 달 연체된 작업 수
    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    )

    // 지난 달 연체된 작업 수
    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", lastMonthEnd.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    )

    const overdueTaskCount = thisMonthOverdueTasks.total
    const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total

    return c.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        incompletedTaskCount,
        incompletedTaskDifference,
        completedTaskCount,
        completedTaskDifference,
        overdueTaskCount,
        overdueTaskDifference,
      },
    })
  })

export default app
