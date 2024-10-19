import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 클래스 이름 병합(스타일)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 초대 코드 생성
export function generateInviteCode(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}
