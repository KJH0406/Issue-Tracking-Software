"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { createWorkspaceSchema } from "../schemas"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DottedSeparator } from "@/components/dotted-separator"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateWorkspace } from "../api/use-create-workspace"
interface CreateWorkspaceFormProps {
  onCancel?: () => void
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const {mutate, isPending} = useCreateWorkspace()

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
  })

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    mutate({json: values})
  }

  return (
   <Card className="w-full h-full border-none shadow-none">
    <CardHeader className="flex p-7">
      <CardTitle className="text-xl font-bold">새로운 워크 스페이스 생성하기</CardTitle>
    </CardHeader>
    <div className="px-7">
      <DottedSeparator />
    </div>
    <CardContent className="p-7">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>워크스페이스 이름</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <DottedSeparator className="py-7"/>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              size="lg"
              variant="secondary"
              onClick={onCancel}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" size="lg" disabled={isPending}>생성</Button>
          </div>
        </form>
      </Form>
    </CardContent>
   </Card>
  )
}
