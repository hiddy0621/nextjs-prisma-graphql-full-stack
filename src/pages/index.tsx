import { signIn, signOut, useSession } from 'next-auth/react'

import { TodoList } from '@/components/TodoList'

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="container mx-auto p-3">
        <div>You logged in as {session.user?.email}</div>
        <TodoList />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  return (
    <div className="container mx-auto p-3">
      Not signed in <br />
      <button className="p-3 bg-green-400 text-white" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  )
}
