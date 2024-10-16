"use server"
import { cookies } from "next/headers"
import { Client } from "node-appwrite"
import { AUTH_COOKIE } from "@/features/auth/constants"
import { Account } from "node-appwrite"

export const getCurrent = async () => {
  try {
    // Appwrite 클라이언트 설정
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

    const session = await cookies().get(AUTH_COOKIE)

    if (!session) return null

    client.setSession(session.value)
    const account = new Account(client)

    return await account.get()
  } catch {
    return null
  }
}
