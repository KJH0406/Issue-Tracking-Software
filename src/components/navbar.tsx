import { UserButton } from "@/features/auth/components/user-button" 
import { MobileSidebar } from "./mobile-sidebar"

// 네비게이션 바 컴포넌트
const Navbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">모든 프로젝트와 일감들을 이곳에서 관리하세요.</p>
      </div>
      {/* 모바일 환경에서 사이드바 표시 */}
      <MobileSidebar />
      {/* 사용자 버튼 */}
      <UserButton />
    </nav>
  )
}

export default Navbar