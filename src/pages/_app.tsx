import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps:{session, ...pageProps} }: AppProps) {
  return (
    // NextAuthが持っているセッション情報をProviderに渡す
    <SessionProvider session={session}>
       <Component {...pageProps} />
    </SessionProvider>
  )
}
