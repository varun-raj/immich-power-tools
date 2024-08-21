import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ENV } from "@/config/environment";
import { useConfig } from "@/contexts/ConfigContext";
import { loginWithPopup } from "@/helpers/login.helper";
import { buildURL } from "@/helpers/string.helper";
import React from "react";

const generateGoogleURL = (clientId: string, redirectURL?: string) =>
  buildURL("https://accounts.google.com/o/oauth2/v2/auth", {
    client_id: clientId,
    redirect_uri: redirectURL,
    scope:
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.appendonly",
    response_mode: "form_post",
    response_type: "code",
    state: redirectURL,
  });

export default function GAImportAuth() {
  
  const { baseURL, googleClientId } = useConfig();
  const { toast } = useToast();
  const url = generateGoogleURL(googleClientId, `${baseURL}/api/auth/callback/google`)
  console.log(url);
  const handleSignin = () => {
    console.log(url);
    loginWithPopup({url}).then(() => {
      console.log("Logged in");
    }).catch((error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    });
  };

  return (
    <div className="flex justify-center items-center flex-col gap-2 w-full">
      <div>
        <Button onClick={handleSignin}>Sign in with Google</Button>
      </div>
    </div>
  );
}
