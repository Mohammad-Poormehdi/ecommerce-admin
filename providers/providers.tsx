"use client"

import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"

import { ModalProvider } from "./modal-provider"
import { ToasterProvider } from "./toast-provider"

interface ProvidersProps {
  children: ReactNode
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient()
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ToasterProvider />
          <ModalProvider />
          {children}
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}

export default Providers
