import React from "react";
import Link from "next/link";
import {
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Head from "next/head";
import { sidebarNavs } from "@/config/constants/sidebarNavs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

interface IProps {
  leftComponent?: React.ReactNode | string;
  rightComponent?: React.ReactNode | string;
}
export default function Header({ leftComponent, rightComponent }: IProps) {
  const { pathname } = useRouter();
  const renderLeftComponent = () => {
    if (typeof leftComponent === "string") {
      return <p className="font-semibold">{leftComponent}</p>;
    }
    return leftComponent;
  };

  const renderRightComponent = () => {
    if (typeof rightComponent === "string") {
      return <p>{rightComponent}</p>;
    }
    return rightComponent;
  }

  return (
    <>
    {typeof leftComponent === "string" && (
      <Head>
        <title>{leftComponent} - Immich Power Tools</title>
      </Head>
    )}
    <header key="header" className="sticky z-10 top-0 w-full flex h-14 items-center gap-4 border-b bg-white dark:bg-black px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            {sidebarNavs.map((nav) => (
              <Link
                key={nav.title}
                href={nav.link}
                className={
                  cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ", {
                    "bg-muted text-foreground": nav.link === pathname,
                    "text-muted-foreground hover:text-foreground": nav.link !== pathname,
                  })
                }
              >
                {nav.icon}
                {nav.title}
              </Link>
            ))}

          </nav>
          
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {renderLeftComponent()}
      </div>
      {renderRightComponent()}
    </header>
    </>
  );
}
