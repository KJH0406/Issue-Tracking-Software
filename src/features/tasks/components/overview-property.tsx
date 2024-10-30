interface OverviewPropertyProps {
  label: string
  children: React.ReactNode
}

// 오버뷰 속성 컴포넌트
export const OverviewProperty = ({
  label,
  children,
}: OverviewPropertyProps) => {
  return (
    <div className="flex items-start gap-x-2">
      <div className="min-w-[100px]">
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-center gap-x-2">{children}</div>
    </div>
  )
}
