// 클라이언트 측 상태 관리와 관련된 React Query를 사용
"use client"

import {
  isServer, // 코드가 서버에서 실행 중인지, 클라이언트에서 실행 중인지 확인하는 유틸리티
  QueryClient, // 각 요청에 대한 데이터를 캐싱하고 관리하는 클라이언트 인스턴스
  QueryClientProvider, // 앱 내에서 서버 데이터를 쿼리하고 캐싱하는 기능
} from "@tanstack/react-query"

// QueryClient 인스턴스를 생성
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // // 1분 동안 데이터를 stale(오래됨) 상태로 취급하지 않도록 설정(재요청 방지)
      },
    },
  })
}

// 초기 렌더링 시 재생성 방지
let browserQueryClient: QueryClient | undefined = undefined

// 서버/클라이언트 QueryClient 생성 구분
function getQueryClient() {
  // 서버 처리
  if (isServer) {
    return makeQueryClient()
  } else {
    // 클라이언트 처리
    // 이미 생성된 QueryClient가 없다면 새로 만들고, 있다면 기존의 것을 재사용
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

interface QueryProviderProps {
  children: React.ReactNode
}

// 컴포넌트 트리 전체에 제공
export const QueryProvider = ({ children }: QueryProviderProps) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
