import { useQueryState, parseAsBoolean } from "nuqs"

// 프로젝트 생성 모달 훅
export const useCreateProjectModal = () => {
  // 프로젝트 생성 모달 오픈 여부
  const [isOpen, setIsOpen] = useQueryState(
    // 쿼리 파라미터 키
    "create-project",
    // 쿼리 파라미터 값 파싱 함수
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  )

  // 프로젝트 생성 모달 오픈
  const open = () => setIsOpen(true)
  // 프로젝트 생성 모달 닫기
  const close = () => setIsOpen(false)

  return {
    isOpen,
    setIsOpen,
    open,
    close,
  }
}
