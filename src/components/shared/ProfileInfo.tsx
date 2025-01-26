import React from "react";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useConfig } from "@/contexts/ConfigContext";
import { logoutUser } from "@/handlers/api/user.handler"
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { useToast } from "../ui/use-toast";
import { HandshakeIcon } from "lucide-react";

export default function ProfileInfo() {
  const { updateContext, ...user } = useCurrentUser()
  const { immichURL, exImmichUrl, version } = useConfig();
  const toast = useToast();

  const handleLogout = () => logoutUser()
    .then(() => {
      updateContext(null)
    }).catch((error) => {
      toast.toast({
        title: "Error",
        description: error.message,
      })
    })


  return (
    <>
      <div className="flex flex-col gap-2 text-xs text-center py-2">
        <p className="text-muted-foreground font-mono">Connected to (External)</p>
        <Link href={exImmichUrl} target="_blank" className="font-mono">
          {exImmichUrl}
        </Link>
        <p className="text-muted-foreground font-mono">Connected to (Internal)</p>
        <Link href={immichURL} target="_blank" className="font-mono">
          {immichURL}
        </Link>
        {user && (
          <>
            <p className="text-sm">{user?.name}</p>
            <div className="flex items-center justify-between gap-2 px-2">
              {!user.isUsingAPIKey && (
                <Button variant="destructive" className="h-6 flex-1 text-xs" onClick={handleLogout}>
                  Log Out
                </Button>
              )}
              <Button asChild variant="secondary" className="h-6 flex-1 text-xs flex items-center justify-center gap-2" onClick={handleLogout}>
                <Link href="https://buymeacoffee.com/varunraj"  target="_blank">
                  <HandshakeIcon className="w-4 h-4" />
                  Support
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="border-t text-muted-foreground text-xs py-2 flex justify-between items-center px-2">
        <p>
          Made with <span className="text-red-500">&hearts;</span> by{" "}
          <Link
            target="_blank"
            href="https://x.com/zathvarun"
            className="text-primary"
          >
            @zathvarun
          </Link>
        </p>
        <Link target="_blank" href={`https://github.com/varun-raj/immich-power-tools/releases/tag/v${version}`}>
          v{version}
        </Link>
      </div>
    </>
  );
}
