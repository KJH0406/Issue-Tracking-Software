import { getCurrent } from "@/features/auth/queries"
import SignInCard from "@/features/auth/components/sign-in-card"
import { redirect } from "next/navigation"

// 로그인 페이지
const SignInPage = async () => {
  const user = await getCurrent()

  if (user) redirect("/")
  return <SignInCard />
}

export default SignInPage
