import { z } from "zod"
import { Hono } from "hono"
import { ID, Query } from "node-appwrite"
import { zValidator } from "@hono/zod-validator"

import { getMember } from "@/features/members/utils"

import { sessionMiddleware } from "@/lib/session-middleware"
import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config"

import { createProjectSchema, updateProjectSchema } from "../schemas"
import { Project } from "../types"

import { MemberRole } from "@/features/members/types"

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases") // 데이터베이스 가져오기
      const storage = c.get("storage") // 스토리지 가져오기
      const user = c.get("user") // 사용자 가져오기

      const { name, image, workspaceId } = c.req.valid("form") // 폼 데이터 가져오기

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      // 멤버가 아니면 401 Unauthorized 응답
      if (!member) {
        return c.json({ error: "unauthorized" }, 401)
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
      }

      // 데이터베이스에 새 프로젝트 문서 생성
      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name, // 프로젝트 이름
          imageUrl: uploadedImageUrl, // 업로드된 이미지 URL (이미지가 없으면 undefined)
          workspaceId, // 워크스페이스 ID
        }
      )

      // 프로젝트 생성 성공
      return c.json({ data: project })
    }
  )

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

  // 프로젝트 업데이트(설정 페이지)
  .patch(
    "/:projectId",
    zValidator("form", updateProjectSchema), // 유효성 검사
    sessionMiddleware,
    async (c) => {
      // appwrite db에서 정보 가져오기
      const databases = c.get("databases") // 데이터베이스 가져오기
      const storage = c.get("storage") // 스토리지 가져오기
      const user = c.get("user") // 사용자 가져오기

      // URL 파라미터에서 프로젝트 ID 추출
      const { projectId } = c.req.param()
      // 유효성 검사를 통과한 폼 데이터 가져오기
      const { name, image } = c.req.valid("form")

      // 프로젝트 조회
      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      )

      // 현재 사용자가 해당 워크스페이스의 멤버인지 확인
      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      })

      // 멤버가 없거나 멤버의 권한이 관리자가 아니면 권한 없음 반환
      if (!member) {
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

      // 수정된 정보로 프로젝트 업데이트 실행
      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        { name, imageUrl: uploadedImageUrl }
      )

      // 프로젝트 업데이트 성공
      return c.json({ data: project })
    }
  )

  // 프로젝트 삭제
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases")
    const user = c.get("user")

    const { projectId } = c.req.param()

    // 프로젝트 정보 조회
    const existingProject = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    )

    // 현재 사용자 멤버 가져오기
    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    })

    // 멤버가 아니면 권한 없음 반환
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    // 프로젝트 삭제 실행
    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId)

    return c.json({ data: { $id: existingProject.$id } })
  })

export default app
