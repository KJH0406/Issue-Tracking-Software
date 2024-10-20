import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"
import SignUpCard from "@/features/auth/components/sign-up-card"

// 회원가입 페이지
const SignUpPage = async () => {
  const user = await getCurrent()

  if (user) redirect("/")
  return <SignUpCard />
}

export default SignUpPage
