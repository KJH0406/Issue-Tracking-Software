import { createSessionClient } from "@/lib/appwrite"

// 현재 로그인한 사용자 정보 조회
export const getCurrent = async () => {
  try {
    // 세션 클라이언트 생성
    const { account } = await createSessionClient()
    return await account.get()
  } catch {
    return null
  }
}
