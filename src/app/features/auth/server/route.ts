import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

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

      console.log({ name, email, password })

      return c.json({ name, email, password })
    }
  )

export default app
