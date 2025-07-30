'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { Session } from '@supabase/auth-helpers-react'

export default function SupabaseProvider({
  children,
  initialSession
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}
