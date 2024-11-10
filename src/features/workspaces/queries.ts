"use server"

import { DATABASE_ID } from "@/config"
import { MEMBERS_ID, WORKSPACE_ID } from "@/config"

import { Query } from "node-appwrite"
import { createSessionClient } from "@/lib/appwrite"

// 모든 워크스페이스 가져오기
export const getWorkspaces = async () => {
  const { account, databases } = await createSessionClient()
  const user = await account.get()

  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", user.$id),
  ])

  if (members.total === 0) {
    return { documents: [], total: 0 }
  }

  const workspaceIds = members.documents.map((member) => member.workspaceId)

  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACE_ID, [
    Query.orderDesc("$createdAt"),
    Query.contains("$id", workspaceIds),
  ])

  return workspaces
}

// 워크스페이스 조회를 위한 속성
interface GetWorkspaceProps {
  workspaceId: string // 조회할 워크스페이스의 고유 ID
}
