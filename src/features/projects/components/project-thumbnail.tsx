import { cn } from "@/lib/utils"

import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// 프로젝트 썸네일 컴포넌트 타입
interface ProjectThumbnailProps {
  image: string
  name: string
  className?: string
  fallbackClassName?: string
}

// 프로젝트 썸네일
export const ProjectThumbnail = ({
  image,
  name,
  className,
  fallbackClassName,
}: ProjectThumbnailProps) => {
  // 이미지가 있으면 이미지를 출력
  if (image) {
    return (
      <div
        className={cn("size-5 relative rounded-md overflow-hidden", className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    )
  }
  // 이미지가 없으면 기본 아바타를 출력
  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "text-white bg-blue-600 font-semibold text-sm uppercase rounded-md",
          fallbackClassName
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
