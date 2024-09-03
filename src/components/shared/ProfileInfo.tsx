import { getMe } from "@/handlers/api/user.handler";
import { IUser } from "@/types/user";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useConfig } from "@/contexts/ConfigContext";
import { logoutUser } from "@/handlers/api/user.handler"
import { useRouter } from 'next/router';

export default function ProfileInfo() {
  const router = useRouter();
  const { immichURL,exImmichUrl } = useConfig();
  const [user, setUser] = React.useState<IUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = () => {
    return getMe()
      .then(setUser)
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => setLoading(false));
  };
  const handleLogout = () => { 

    logoutUser().then((status) => {
      console.log(status)
      router.push('/login');
    }).catch((error) => {
      setErrorMessage(error.message)
    })

  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div>{errorMessage}</div>;

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
        <p className="text-sm">{user?.name}</p>
        <Button variant="destructive" className="mx-4" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      <div className="border text-muted-foreground text-xs text-center py-2">
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
      </div>
    </>
  );
}
