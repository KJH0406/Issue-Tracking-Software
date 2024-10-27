import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { CreateProjectModal } from "@/features/projects/components/create-project-modal"
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal"
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <div className="flex w-full h-full">
        <div className="fixed top-0 left-0 hidden lg:block h-full lg:w-[264px] overflow-y-auto">
          {/* 화면 좌측에 고정된 Sidebar, 작은 화면에서는 숨김 */}
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            {/* 화면 상단에 고정된 Navbar */}
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col">
              {/* 페이지 메인 콘텐츠 영역 */}
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
