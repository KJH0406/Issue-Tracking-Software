import { Loader } from "lucide-react"

// 대시보드 로딩 컴포넌트
const DashboardLoading = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export default DashboardLoading
