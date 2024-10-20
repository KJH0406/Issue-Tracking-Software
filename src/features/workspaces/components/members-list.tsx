"use client"

import Link from "next/link"
import { Fragment } from "react"
import { ArrowLeftIcon, MoreHorizontalIcon } from "lucide-react"

import { MemberRole } from "@/features/members/types"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { MemberThumbnail } from "@/features/members/components/member-thumbnail"
import { useDeleteMember } from "@/features/members/api/use-delete-member"
import { useUpdateMember } from "@/features/members/api/use-update-member"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

import { Button } from "@/components/ui/button"
import { useConfirm } from "@/hooks/use-confirm"

import { Separator } from "@/components/ui/separator"
import { DottedSeparator } from "@/components/dotted-separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 워크스페이스 멤버 목록
export const MembersList = () => {
  const workspaceId = useWorkspaceId()

  const [ConfirmDialog, confirm] = useConfirm(
    "사용자 삭제하기",
    "사용자를 삭제하면 해당 사용자는 워크스페이스에서 사라집니다.",
    "destructive"
  )

  const { data } = useGetMembers({ workspaceId })

  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember()

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember()

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ json: { role }, param: { memberId } })
  }

  const handleDeleteMember = async (memberId: string) => {
    const result = await confirm()
    if (!result) return
    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload()
        },
      }
    )
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            뒤로가기
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">사용자 목록</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((member, idx) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberThumbnail
                className="size-10"
                fallbackClassName="text-lg"
                name={member.name}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreHorizontalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={isUpdatingMember}
                  >
                    관리자로 설정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.MEMBER)
                    }
                    disabled={isUpdatingMember}
                  >
                    사용자로 설정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-red-700"
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={isDeletingMember}
                  >
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {idx !== data?.documents.length - 1 && (
              <Separator className="my-3" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}
