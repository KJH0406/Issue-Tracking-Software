import { cn } from "@/lib/utils"

import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// 워크스페이스 썸네일 컴포넌트 타입
interface WorkspaceThumbnailProps {
  image: string
  name: string
  className?: string
}

// 워크스페이스 썸네일
export const WorkspaceThumbnail = ({
  image,
  name,
  className,
}: WorkspaceThumbnailProps) => {
  // 이미지가 있으면 이미지를 출력
  if (image) {
    return (
      <div
        className={cn("size-10 relative rounded-md overflow-hidden", className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    )
  }
  // 이미지가 없으면 기본 아바타를 출력
  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
