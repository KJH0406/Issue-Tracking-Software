import { useQueryState, parseAsBoolean } from "nuqs"

// 일감 생성 모달 훅
export const useCreateTaskModal = () => {
  // 일감 생성 모달 오픈 여부
  const [isOpen, setIsOpen] = useQueryState(
    // 쿼리 파라미터 키
    "create-task",
    // 쿼리 파라미터 값 파싱 함수
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  )

  // 일감 생성 모달 오픈
  const open = () => setIsOpen(true)
  // 일감 생성 모달 닫기
  const close = () => setIsOpen(false)

  return {
    isOpen,
    setIsOpen,
    open,
    close,
  }
}
