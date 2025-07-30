'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import CreateEntryForm from '@/components/CreateEntryForm'

type Entry = {
  id: string
  day_number: number
  date: string
  intention: string
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.replace('/login')
      return
    }

    async function fetchEntries() {
      if (!session) return
      const { data, error } = await supabase
        .from('bitacora_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('day_number', { ascending: true })

      if (error) console.error(error)
      else setEntries(data)
    }

    fetchEntries()

    const channel = supabase
      .channel('bitacora-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bitacora_entries'
        },
        fetchEntries
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  if (!session) return null

  return (
    <main className='p-4 max-w-2xl mx-auto space-y-6'>
      <h1 className='text-2xl font-bold'>Entradas de Bitácora</h1>
      <p className='text-sm text-gray-500'>
        Sesión iniciada como: <strong>{session.user.email}</strong>
      </p>

      {/* ✅ Crear entrada */}
      <CreateEntryForm />

      {/* ✅ Lista de entradas */}
      <ul className='space-y-2'>
        {entries.map((entry) => (
          <li key={entry.id} className='border p-2 rounded'>
            <p>
              <strong>Día {entry.day_number}</strong>
            </p>
            <p>{entry.intention}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
