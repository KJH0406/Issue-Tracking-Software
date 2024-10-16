import "server-only"

import {
  Account,
  Client,
  Databases,
  Models,
  Storage,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite"

import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"

import { AUTH_COOKIE } from "@/app/features/auth/constants"

// 미들웨어에서 사용할 데이터 타입 명시
type AdditionalContext = {
  Variables: {
    account: AccountType
    databases: DatabasesType
    storage: StorageType
    users: UsersType
    user: Models.User<Models.Preferences>
  }
}

// 세션 기반 인증 처리
export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    // Appwrite 클라이언트 설정
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

    // 쿠키에서 세션 정보 가져오기
    const session = getCookie(c, AUTH_COOKIE)

    // 세션이 없으면 인증되지 않은 상태로 처리 (401 Unauthorized)
    if (!session) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    // 세션을 Appwrite 클라이언트에 설정하여 인증 상태 유지
    client.setSession(session)

    const account = new Account(client)
    const databases = new Databases(client)
    const storage = new Storage(client)

    // 현재 로그인한 사용자의 정보 가져오기
    const user = await account.get()

    // 미들웨어 컨텍스트에 Appwrite 객체들을 저장 (다른 라우트에서 사용 가능)
    c.set("account", account)
    c.set("databases", databases)
    c.set("storage", storage)
    c.set("user", user)

    // 다음 미들웨어 or 라우트 처리
    await next()
  }
)
