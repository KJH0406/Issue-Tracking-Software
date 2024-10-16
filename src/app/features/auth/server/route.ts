import { Hono } from "hono"
import { ID } from "node-appwrite"
import { zValidator } from "@hono/zod-validator"
import { setCookie } from "hono/cookie"

import { createAdminClient } from "@/lib/appwrite"

import { AUTH_COOKIE } from "../constants"
import { loginSchema, registerSchema } from "../schema"

const app = new Hono()
  // 로그인 요청
  .post(
    "/login",
    // 로그인 시 유효성 검사
    zValidator("json", loginSchema),
    async (c) => {
      const { email, password } = c.req.valid("json")

      console.log({ email, password })

      return c.json({ email, password })
    }
  )

  // 회원가입 요청
  .post(
    "/register",
    // 회원가입 시 유효성 검사
    zValidator("json", registerSchema),
    async (c) => {
      const { name, email, password } = c.req.valid("json")

      // Appwrite 클라이언트의 Account 객체 접근
      const { account } = await createAdminClient()

      // 새로운 사용자를 Appwrite에 등록
      const user = await account.create(ID.unique(), email, password, name)

      // 로그인 세션 정보 반환
      const session = await account.createEmailPasswordSession(email, password)

      // 로그인 후 세션 쿠키를 설정(인증된 상태를 유지)
      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/", // 모든 경로에서 유효
        httpOnly: true, // XSS 방지
        secure: true,
        sameSite: "strict", // CSRF 방지
        maxAge: 60 * 60 * 24 * 30, // 유효 기간 설정(30일)
      })

      return c.json({ data: user })
    }
  )

export default app
