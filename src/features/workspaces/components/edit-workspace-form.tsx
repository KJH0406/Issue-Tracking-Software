"use client"

import { z } from "zod"
import { useRef } from "react"
import Image from "next/image"
import { ImageIcon, ArrowLeftIcon, CopyIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { useConfirm } from "@/hooks/use-confirm"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DottedSeparator } from "@/components/dotted-separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form"

import { Workspace } from "../types"
import { updateWorkspaceSchema } from "../schemas"
import { useUpdateWorkspace } from "../api/use-update-workspace"
import { useDeleteWorkspace } from "../api/use-delete-workspace"
import { useResetInviteCode } from "../api/use-reset-invite-code"
import { toast } from "sonner"

// 워크스페이스 업데이트 폼 컴포넌트 속성
interface EditWorkspaceFormProps {
  onCancel?: () => void
  initialValues: Workspace
}

// 워크스페이스 업데이트 폼 컴포넌트
export const EditWorkspaceForm = ({
  initialValues,
  onCancel,
}: EditWorkspaceFormProps) => {
  const router = useRouter()

  // 워크스페이스 업데이트 훅
  const { mutate, isPending } = useUpdateWorkspace()

  // 워크스페이스 삭제 훅
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace()

  // 워크스페이스 초대 코드 재설정 훅
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode()

  // 입력 요소에 대한 참조
  const inputRef = useRef<HTMLInputElement>(null)

  // 폼 생성
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      // 초기 값 설정
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  })

  // 폼 제출
  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    }
    // 폼 제출
    mutate(
      { param: { workspaceId: initialValues.$id }, form: finalValues },
      {
        onSuccess: () => {
          router.push(`/workspaces/${initialValues.$id}`)
        },
      }
    )
  }

  // 이미지 업로드
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] // 파일 객체 가져오기
    // 파일 객체가 있으면 폼에 추가
    if (file) {
      form.setValue("image", file)
    }
  }

  const [DeleteDialog, confirmDelete] = useConfirm(
    "⚠️ 워크스페이스 삭제",
    "워크스페이스를 삭제하면 워크스페이스에 속한 모든 데이터가 삭제되며 복구할 수 없습니다.",
    "destructive"
  )

  // 워크스페이스 삭제
  const handleDelete = async () => {
    const result = await confirmDelete()
    if (!result) return

    // 워크스페이스 삭제 뮤테이션 실행
    deleteWorkspace(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          window.location.href = "/"
        },
      }
    )
  }

  // 워크스페이스 초대 링크
  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/invite/${initialValues.inviteCode}`

  // 초대 링크 복사 함수
  const copyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      toast.success("워크스페이스 초대 링크가 복사되었습니다.")
    })
  }

  // 워크스페이스 초대 코드 재설정 다이얼로그 매개변수
  const [ResetInviteDialog, confirmResetInvite] = useConfirm(
    "⚠️ 워크스페이스 초대 코드 재설정",
    "워크스페이스 초대 코드를 재설정하면 기존 초대 코드는 더 이상 사용할 수 없습니다.",
    "destructive"
  )

  // 워크스페이스 초대 코드 재설정
  const handleResetInviteCode = async () => {
    const result = await confirmResetInvite()
    if (!result) return

    // 워크스페이스 초대 코드 재설정 뮤테이션 실행
    resetInviteCode(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          router.refresh()
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* 워크스페이스 삭제 */}
      <DeleteDialog />
      {/* 워크스페이스 초대 코드 재설정 */}
      <ResetInviteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={
              // 취소 함수가 있으면 취소 함수 호출
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            뒤로가기
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>워크스페이스 이름</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="워크스페이스 이름을 입력해주세요."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Logo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">
                            워크스페이스 아이콘
                          </p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG, JPEG 파일만 최대 1MB까지 업로드 할 수
                            있습니다.
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .svg, .jpeg"
                            ref={inputRef}
                            onChange={handleImageChange}
                            disabled={isPending}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="destructive"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => {
                                if (inputRef.current) {
                                  inputRef.current.value = ""
                                  field.onChange("")
                                }
                              }}
                            >
                              이미지 초기화
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="teritary"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              이미지 업로드
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />

                <DottedSeparator className="py-7" />
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isPending}
                    className={cn(!onCancel && "invisible")}
                  >
                    취소
                  </Button>
                  <Button type="submit" size="lg" disabled={isPending}>
                    저장
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">📩 워크스페이스 사용자 초대</h3>
            <p className="text-sm text-muted-foreground">
              워크스페이스 초대코드를 통해 워크스페이스에 사용자를 초대할 수
              있습니다.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input value={fullInviteLink} />
                <Button
                  className="size-12"
                  variant="secondary"
                  onClick={copyInviteLink}
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isResettingInviteCode}
              onClick={handleResetInviteCode}
            >
              워크스페이스 초대코드 재설정
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">⚠️ 워크스페이스 삭제</h3>
            <p className="text-sm text-muted-foreground">
              워크스페이스를 삭제하면 워크스페이스에 속한 모든 데이터가 삭제되며
              복구할 수 없습니다.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeleting}
              onClick={handleDelete}
            >
              워크스페이스 삭제
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
