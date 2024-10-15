// Hono API 서버에 요청을 보내는 클라이언트 정의
import { hc } from "hono/client"

// 서버에서 정의한 API 타입을 가져와 클라이언트에서도 일관된 타입으로 API를 사용
import { AppType } from "@/app/api/[[...route]]/route"

// 제네릭을 사용(AppType)하여 API 타입을 지정
// 클라이언트에서 API 요청을 할 때, 서버와 일치하는 타입으로 작업
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!)
