import { Query, type Databases } from "node-appwrite"

import { DATABASE_ID, MEMBERS_ID } from "@/config"

// 멤버 타입 정의
interface GetMemberProps {
  databases: Databases
  workspaceId: string
  userId: string
}

// 멤버 가져오기
export const getMember = async ({
  databases,
  workspaceId,
  userId,
}: GetMemberProps) => {
  // Appwrite 데이터베이스에서 문서 목록을 조회
  const member = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("workspaceId", workspaceId), // workspaceId가 일치하는 문서 필터링
    Query.equal("userId", userId), // userId가 일치하는 문서 필터링
  ])

  // 조회된 문서 중 첫 번째 문서를 반환 (해당 멤버의 정보)
  return member.documents[0]
}
