import { IUser } from "@/types/user";
import Sidebar from "../shared/Sidebar";
import { Toaster } from "../ui/toaster";
import { ReactNode, useEffect, useState } from "react";
import { getMe } from "@/handlers/api/user.handler";
import UserContext from "@/contexts/CurrentUserContext";
import ErrorBlock from "../shared/ErrorBlock";
import Loader from "../ui/loader";
import { ArrowRight, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "../auth/LoginForm";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<{
    error: string;
    message: string;
  } | null>(null);

  const fetchData = () => {
    return getMe()
      .then(setUser)
      .catch((error) => {
        if (error.status === 403) return setUser(null);
        return setErrorMessage(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (errorMessage)
    
    return (
      <div className="min-h-screen flex flex-col justify-center">
        <ErrorBlock
          icon={<TriangleAlert />}
          title={errorMessage.error}
          description={errorMessage.message}
          action={
            <Link
              className="flex items-center gap-2 text-xs"
              href={
                "https://github.com/varun-raj/immich-power-tools?tab=readme-ov-file#-getting-started"
              }
              target="_blank"
            >
              Setup Instructions
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );

  if (!user) return <LoginForm />;

  return (
    <UserContext.Provider value={user}>
      <div className="grid max-h-screen min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <Sidebar />
        <div className="flex flex-col">{children}</div>
        <Toaster />
      </div>
    </UserContext.Provider>
  );
}
