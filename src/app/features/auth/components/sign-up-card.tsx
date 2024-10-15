import { z } from "zod"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { DottedSeparator } from "@/components/dotted-separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { registerSchema } from "../schema"
import { useRegister } from "../api/use-register"

const SignUpCard = () => {
  const { mutate } = useRegister()

  const form = useForm<z.infer<typeof registerSchema>>({
    // 유효성 검사
    resolver: zodResolver(registerSchema),
    // 기본값 설정
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // 회원가입 처리
  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({ json: values })
  }

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">회원 가입</CardTitle>
        <CardDescription>
          회원 가입을 완료하면{" "}
          <Link href="/privacy">
            <span className="text-blue-700">개인정보 처리방침</span>
          </Link>{" "}
          과{" "}
          <Link href="/terms">
            <span className="text-blue-700">이용약관</span>
          </Link>{" "}
          에 동의하게 됩니다.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="이름을 입력해주세요."
                    />
                  </FormControl>
                  {/* 유효성 검사 실패 시 오류 메시지 출력 */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="이메일 주소를 입력해주세요."
                    />
                  </FormControl>
                  {/* 유효성 검사 실패 시 오류 메시지 출력 */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="비밀번호를 입력해주세요."
                    />
                  </FormControl>
                  {/* 유효성 검사 실패 시 오류 메시지 출력 */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={false} size="lg" className="w-full">
              로그인
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Google로 로그인
        </Button>
        <Button
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Github로 로그인
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          이미 가입한 계정이 있으신가요?
          <Link href="./sign-up">
            <span className="text-blue-700">&nbsp;로그인</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignUpCard
