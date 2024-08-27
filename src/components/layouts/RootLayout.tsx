import { IUser } from "@/types/user";
import Sidebar from "../shared/Sidebar";
import { Toaster } from "../ui/toaster";
import { ReactNode, useEffect, useState } from "react";
import { getMe } from "@/handlers/api/user.handler";
import UserContext from "@/contexts/CurrentUserContext";
import ErrorBlock from "../shared/ErrorBlock";
import Loader from "../ui/loader";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = () => {
    return getMe()
      .then(setUser)
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />
  if (errorMessage) return <ErrorBlock description={errorMessage} />;
  if (!user) return null;

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
