import { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex items-center justify-center h-full bg-black">
        {children}
      </div>
    </>
  )
}

export default AuthLayout
