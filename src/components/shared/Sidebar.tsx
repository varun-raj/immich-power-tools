import Link from "next/link";

import { sidebarNavs } from "@/config/constants/sidebarNavs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import ProfileInfo from "./ProfileInfo";

const ThemeSwitcher = dynamic(() => import("@/components/shared/ThemeSwitcher"), {
  ssr: false,
});

export default function Sidebar() {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="hidden border-r bg-muted/40 md:block max-h-screen min-h-screen">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-between border-b px-2 lg:h-[60px] lg:px-2">
          <Link href="/" className="flex items-center gap-1 font-semibold">
            <img
              src="/favicon.png"
              width={32}
              height={32}
              alt="Immich Power Tools"
              className="w-8 h-8"
            />
            <span className="">Immich Power Tools</span>
          </Link>
          <ThemeSwitcher />
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sidebarNavs.map((nav) => (
              <Link
                key={nav.title}
                href={nav.link}
                className={cn(
                  "flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary",
                  {
                    "text-primary": pathname === nav.link,
                  }
                )}
              >
                {nav.icon}
                {nav.title}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <ProfileInfo />
        </div>
      </div>
    </div>
  );
}
