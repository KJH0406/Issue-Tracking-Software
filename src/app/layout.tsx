import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { cn } from "../lib/utils"

import "./globals.css"
import { QueryProvider } from "@/components/query-provider"
import { Toaster } from "@/components/ui/sonner"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "워크웨이브",
  description: "업무의 흐름을 혁신하다",
  openGraph: {
    title: "워크웨이브",
    description: "업무의 흐름을 혁신하다",
    url: "https://myworkwave.vercel.app", // 사이트 URL
    images: [
      {
        url: "https://myworkwave.vercel.app/thumbnail.png", // 썸네일 이미지 URL
        width: 1200, // 권장 크기
        height: 630, // 권장 크기
        alt: "워크웨이브 썸네일 이미지",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "워크웨이브",
    description: "업무의 흐름을 혁신하다",
    images: ["https://myworkwave.vercel.app/thumbnail.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
