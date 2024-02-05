import './App.css'
import { useState, useEffect } from 'react'
import { Auth } from './Auth'
import { Account } from './Account'
import { Session } from "@supabase/gotrue-js/src/lib/types"
import useSupabase from './hooks/useSupabase'

export const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null)
  const supabase = useSupabase();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [supabase.auth])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}
