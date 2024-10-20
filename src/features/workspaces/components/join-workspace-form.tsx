"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { DottedSeparator } from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useInviteCode } from "@/features/workspaces/hooks/use-invite-code"

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string
  }
}

// 워크스페이스 참여 폼
export const JoinWorkspaceForm = ({
  initialValues,
}: JoinWorkspaceFormProps) => {
  const router = useRouter()
  // 워크스페이스 ID
  const workspaceId = useWorkspaceId()
  // 워크스페이스 초대 코드
  const inviteCode = useInviteCode()

  // 워크스페이스 참여 뮤테이션
  const { mutate, isPending } = useJoinWorkspace()

  const onSubmit = () => {
    // 워크스페이스 참여 뮤테이션 호출
    mutate(
      {
        // 워크스페이스 ID
        param: {
          workspaceId,
        },
        // 워크스페이스 초대 코드
        json: {
          code: inviteCode,
        },
      },
      {
        // 성공 시 처리
        onSuccess: ({ data }) => {
          // 워크스페이스 참여 성공 시 리다이렉트
          router.push(`/workspaces/${data.$id}`)
        },
      }
    )
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">
          워크스페이스에 참여하기
        </CardTitle>
        <CardDescription>
          <strong>"{initialValues.name}"</strong> 워크스페이스에 참여하세요.
        </CardDescription>
      </CardHeader>
      <div className="p-7">
        <DottedSeparator />
      </div>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          <Button
            className="w-full lg:w-fit"
            variant="secondary"
            type="button"
            size="lg"
            disabled={isPending}
          >
            <Link href="/">취소</Link>
          </Button>
          <Button
            className="w-full lg:w-fit"
            type="button"
            size="lg"
            onClick={onSubmit}
            disabled={isPending}
          >
            참여하기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
