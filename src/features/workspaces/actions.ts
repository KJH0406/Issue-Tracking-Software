"use server"

import { Databases } from "node-appwrite"

import { DATABASE_ID } from "@/config"
import { MEMBERS_ID, WORKSPACE_ID } from "@/config"

import { cookies } from "next/headers"
import { Account, Client, Query } from "node-appwrite"

import { getMember } from "@/features/members/utils"
import { AUTH_COOKIE } from "@/features/auth/constants"

import { Workspace } from "./types"

// 모든 워크스페이스 가져오기
export const getWorkspaces = async () => {
  try {
    // Appwrite 클라이언트 설정
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

    const session = await cookies().get(AUTH_COOKIE)

    if (!session) return { documents: [], total: 0 }

    client.setSession(session.value)
    const databases = new Databases(client)
    const account = new Account(client)
    const user = await account.get()

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ])

    if (members.total === 0) {
      return { documents: [], total: 0 }
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId)

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    )

    return workspaces
  } catch {
    return { documents: [], total: 0 }
  }
}

// 워크스페이스 조회를 위한 속성
interface GetWorkspaceProps {
  workspaceId: string // 조회할 워크스페이스의 고유 ID
}

// 단일 워크스페이스 가져오기
export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    // Appwrite 클라이언트 초기화 및 설정
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

    // 쿠키에서 인증 세션 정보 가져오기
    const session = await cookies().get(AUTH_COOKIE)

    // 세션이 없으면 (로그인되지 않은 상태) null 반환
    if (!session) return null

    // 클라이언트에 세션 설정
    client.setSession(session.value)

    // Appwrite 서비스 인스턴스 생성
    const databases = new Databases(client)
    const account = new Account(client)

    // 현재 로그인한 사용자 정보 가져오기
    const user = await account.get()

    // 현재 사용자가 요청한 워크스페이스의 멤버인지 확인
    const member = await getMember({ databases, userId: user.$id, workspaceId })

    // 멤버가 아니면 null 반환 (접근 권한 없음)
    if (!member) return null

    // 워크스페이스 정보 가져오기
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
    )

    // 워크스페이스 정보 반환
    return workspace
  } catch {
    // 오류 발생 시 null 반환
    return null
  }
}
