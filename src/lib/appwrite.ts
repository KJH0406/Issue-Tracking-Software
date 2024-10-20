import "server-only" // 서버에서만 실행되도록 강제

import { Client, Account, Storage, Users, Databases } from "node-appwrite"

import { cookies } from "next/headers"
import { AUTH_COOKIE } from "@/features/auth/constants"

// 세션 클라이언트 생성
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

  const session = await cookies().get(AUTH_COOKIE)

  if (!session || !session.value) {
    throw new Error("Unauthorized")
  }

  client.setSession(session.value)

  return {
    get account() {
      return new Account(client)
    },
    get databases() {
      return new Databases(client)
    },
  }
}

// 관리자 클라이언트 생성
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!)

  return {
    // 계정 클라이언트
    get account() {
      return new Account(client)
    },

    // 사용자 클라이언트
    get users() {
      return new Users(client)
    },
  }
}
