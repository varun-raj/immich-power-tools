import Link from "next/link";
import { Bell, Camera, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { sidebarNavs } from "@/config/constants/sidebarNavs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { Badge } from "../ui/badge";
import { ENV } from "@/config/environment";

export default function Sidebar() {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="hidden border-r bg-muted/40 md:block max-h-screen min-h-screen">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img
              src="/favicon.png"
              alt="Immich Power Tools"
              className="w-8 h-8"
            />
            <span className="">Immich Power Tools</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sidebarNavs.map((nav) => (
              <Link
                key={nav.title}
                href={nav.link}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  {
                    "text-primary": pathname === nav.link,
                  }
                )}
              >
                {nav.icon}
                {nav.title}
                {nav.badge && (
                  <Badge variant="outline" className="rounded-full text-nowrap">
                    {nav.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div>
        <div className="flex flex-col gap-1 text-xs text-center py-2">
            <p className="text-gray-800 font-mono">Connected to</p>
            <Link href={ENV.IMMICH_URL} target="_blank" className="font-mono">
              {ENV.IMMICH_URL}
            </Link>
          </div>
        <div className="border text-gray-700 text-xs text-center py-2">
          
          <p>
            Made with <span className="text-red-500">&hearts;</span> by <Link target="_blank" href="https://x.com/zathvarun" className="text-primary">@zathvarun</Link>
          </p>
        </div>
        </div>

      </div>
    </div>
  );
}
