import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "@/styles/style.css";
import "@/styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
