import Image from "next/image"
import Link from "next/link"

import { DottedSeparator } from "./dotted-separator"
import { Navigation } from "./navigation"

// 사이드바 컴포넌트
const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
     {/* 로고 링크 */}
     <Link href="/">
     <Image src="/logo.svg" alt="logo" width={164} height={48} />
     </Link>
     {/* 점선 구분 */}
     <DottedSeparator className="my-4" />
     {/* 네비게이션 */}
     <Navigation />
    </aside>
  )
} 

export default Sidebar