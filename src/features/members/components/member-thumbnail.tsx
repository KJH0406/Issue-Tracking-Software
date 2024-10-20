import { cn } from "@/lib/utils"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// 멤버 썸네일 컴포넌트 타입
interface MemberThumbnailProps {
  name: string
  className?: string
  fallbackClassName?: string
}

// 멤버 썸네일
export const MemberThumbnail = ({
  name,
  className,
  fallbackClassName,
}: MemberThumbnailProps) => {
  return (
    <Avatar
      className={cn(
        "size-5 transition border border-neutral-300 rounded-full",
        className
      )}
    >
      <AvatarFallback
        className={cn(
          "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
          fallbackClassName
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
