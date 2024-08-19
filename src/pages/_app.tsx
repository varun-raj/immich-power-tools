import RootLayout from "@/components/layouts/RootLayout";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { ThemeProvider } from 'next-themes'


export default function App({ Component, pageProps }: AppProps) {
  return <ThemeProvider attribute="class" storageKey = 'theme'><RootLayout><Component {...pageProps} /></RootLayout></ThemeProvider>
}
