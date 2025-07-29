// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Entry = {
  id: string
  day_number: number
  date: string
  intention: string
}

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    async function fetchEntries() {
      const { data, error } = await supabase
        .from('bitacora_entries')
        .select('*')
        .order('day_number', { ascending: true })

      if (error) {
        console.error('Error al traer las entradas:', error.message, error)
      } else {
        setEntries(data)
      }
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
        (payload) => {
          console.log('Cambio detectado:', payload)
          fetchEntries()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <main className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Entradas de Bitácora</h1>
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
