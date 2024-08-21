
import Sidebar from "../shared/Sidebar"
import { Toaster } from "../ui/toaster"


type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="grid max-h-screen min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        {children}
      </div>
      <Toaster />
    </div>
  )
}
