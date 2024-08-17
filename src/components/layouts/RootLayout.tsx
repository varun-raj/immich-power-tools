
import { cn } from "@/lib/utils"


type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-background font-sans antialiased",
    )}>
      {children}
    </div>
  )
}
