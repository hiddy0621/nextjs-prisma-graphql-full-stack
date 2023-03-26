import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import '@/styles/globals.css'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

// 
const NEXT_PUBLIC_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
if (!NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT not found.')
}

export const client = new ApolloClient({
  uri: NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})

export default function App({ Component, pageProps:{session, ...pageProps} }: AppProps) {
  return (
    // NextAuthが持っているセッション情報をProviderに渡す
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </SessionProvider>
  )
}
