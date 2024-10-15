import { z } from "zod"

// 로그인
export const loginSchema = z.object({
  email: z.string().email("이메일 주소를 입력하세요!"),
  password: z.string().min(1, "비밀번호를 입력하세요!"),
})

// 회원가입
export const registerSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력하세요!"),
  email: z.string().email("이메일 주소를 입력하세요!"),
  password: z.string().min(8, "최소 8자 이상의 비밀번호를 입력하세요!"),
})
