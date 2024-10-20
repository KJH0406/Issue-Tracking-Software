"use server"

import { DATABASE_ID } from "@/config"
import { MEMBERS_ID, WORKSPACE_ID } from "@/config"

import { Query } from "node-appwrite"
import { createSessionClient } from "@/lib/appwrite"

import { getMember } from "@/features/members/utils"

import { Workspace } from "./types"

// 모든 워크스페이스 가져오기
export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient()
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
    const { account, databases } = await createSessionClient()
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
