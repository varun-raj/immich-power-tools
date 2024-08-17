import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>
      {children}
    </div>
  )
}
