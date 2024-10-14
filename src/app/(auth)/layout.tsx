interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div>
      <div>{children}</div>
    </div>
  )
}

export default AuthLayout
