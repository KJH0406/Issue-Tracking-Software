"use client"

import { z } from "zod"
import { useRef } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createProjectSchema } from "../schemas"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DottedSeparator } from "@/components/dotted-separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form"

import { useCreateProject } from "../api/use-create-project"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

// 프로젝트 생성 폼 컴포넌트 속성
interface CreateProjectFormProps {
  onCancel?: () => void
}

// 프로젝트 생성 폼 컴포넌트
export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const workspaceId = useWorkspaceId()
  const router = useRouter()

  // 프로젝트 생성 훅
  const { mutate, isPending } = useCreateProject()

  // 입력 요소에 대한 참조
  const inputRef = useRef<HTMLInputElement>(null)

  // 폼 생성
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    },
  })

  // 폼 제출
  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values, // 기존 값 유지
      workspaceId, // 워크스페이스 ID
      image: values.image instanceof File ? values.image : "", // 이미지가 파일 객체인 경우 폼에 추가
    }
    // 폼 제출
    mutate(
      { form: finalValues },
      {
        // 성공 시 폼 초기화
        onSuccess: ({ data }) => {
          form.reset()
          // 프로젝트 생성 후 프로젝트 페이지로 이동
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
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

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          새로운 프로젝트 생성하기
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
                    <FormLabel>프로젝트 이름</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="프로젝트 이름을 입력해주세요."
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
                        <p className="text-sm font-medium">프로젝트 아이콘</p>
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
                  생성
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
