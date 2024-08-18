
import { cn } from "@/lib/utils"
import Sidebar from "../shared/Sidebar"


type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="grid max-h-screen min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  )
}
