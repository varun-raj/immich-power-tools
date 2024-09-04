import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { loginUser } from "@/handlers/api/user.handler"
import { useConfig } from "@/contexts/ConfigContext"
import { IUser } from "@/types/user"
import Head from "next/head"
import { Tooltip } from "../ui/tooltip"
import { set } from "date-fns"

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account."

interface ILoginFormProps {
  onLogin: (user: IUser) => void
}
export function LoginForm(
  { onLogin }: ILoginFormProps
) {
  const { exImmichUrl } = useConfig()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault() 
    setLoading(true)
    setErrorMessage(null)
    loginUser(formData.email, formData.password)
    .then(onLogin)
    .catch((error) => {
      setErrorMessage(error.message)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <>
    <Head>
      <title>Immich Power Tools - Login</title>
    </Head>
      <div className="relative flex min-h-screen justify-center flex-col bg-background">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <img
              src="/favicon.png"
              width={32}
              height={32}
              alt="Immich Power Tools"
              className="w-8 h-8"
            />
            <CardTitle className="text-2xl">Login to Immich</CardTitle>
            <CardDescription>
              Login to your connected Immich instance <Link href={exImmichUrl} className="text-xs" target="_blank">({exImmichUrl})</Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="border text-center border-red-500 text-red-500 p-2 rounded-lg text-xs" role="alert">
                  <p>{errorMessage}</p>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required 
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Login
              </Button>
              <Button variant="outline" className="w-full" disabled={true}>
                Login with OAuth (Comming Soon)
              </Button>
              <p className="text-xs text-gray-400 text-center">
                Or Use <code>IMMICH_API_KEY</code> in your environment to use API Key instead of password.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
