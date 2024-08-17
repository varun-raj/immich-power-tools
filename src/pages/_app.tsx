import RootLayout from "@/components/layouts/RootLayout";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <RootLayout><Component {...pageProps} /></RootLayout>
}
