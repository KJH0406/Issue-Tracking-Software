import { useParams } from "next/navigation"

// 워크스페이스 초대 코드 가져오기
export const useInviteCode = () => {
  const params = useParams()
  return params.inviteCode as string
}
