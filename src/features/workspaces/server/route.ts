import { Hono } from "hono";
import { ID } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACE_ID, IMAGES_BUCKET_ID } from "@/config";

import { createWorkspaceSchema } from "../schemas";


const app = new Hono()

// 공간 생성 라우트
.post(
    "/",
    zValidator("form", createWorkspaceSchema),
    // 세션 가져오기
    sessionMiddleware,

    // 데이터베이스 가져오기
    async (c) => {
      const databases = c.get("databases") 
      const storage = c.get("storage")
      const user = c.get("user")
      
      const { name, image } = c.req.valid("form")

      // 업로드된 이미지의 URL을 저장할 변수 초기화
      let uploadedImageUrl: string | undefined 

      // 이미지가 제공되었는지 확인
      if (image instanceof File) {
        // 스토리지에 이미지 파일 업로드
        const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image)

        // 업로드된 이미지의 미리보기 가져오기
        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        )

        // ArrayBuffer를 Base64 문자열로 변환하여 데이터 URL 생성
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
      }

      // 데이터베이스에 새 워크스페이스 문서 생성
      const workspace = await databases.createDocument(DATABASE_ID, WORKSPACE_ID, ID.unique(), {
        name,                // 워크스페이스 이름
        userId: user.$id,    // 사용자 ID
        imageUrl: uploadedImageUrl  // 업로드된 이미지 URL (이미지가 없으면 undefined)
      })

      // 워크스페이스 생성 성공
      return c.json({data: workspace})
    }
  )

// 라우트 내보내기
export default app
