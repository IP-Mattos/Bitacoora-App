'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabase'

export default function CreateEntryForm() {
  const session = useSession()

  const [intention, setIntention] = useState('')
  const [replacement, setReplacement] = useState('')
  const [ateJunk, setAteJunk] = useState(false)
  const [didWalk, setDidWalk] = useState(false)
  const [reflection, setReflection] = useState('')
  const [tookPhoto, setTookPhoto] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Verificar si hay sesión al cargar el componente
  useEffect(() => {
    if (!session) {
      setMessage('No hay sesión activa. Por favor, inicia sesión.')
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    // Verificar sesión antes de proceder
    if (!session?.user?.id) {
      setMessage('Error: no hay sesión activa. Por favor, inicia sesión.')
      setIsLoading(false)
      return
    }

    try {
      // Debug: verificar el user_id
      console.log('User ID from session:', session.user.id, typeof session.user.id)

      // Obtener el último día del usuario
      const { data: existingEntries, error: fetchError } = await supabase
        .from('bitacora_entries')
        .select('day_number')
        .eq('user_id', session.user.id)
        .order('day_number', { ascending: false })
        .limit(1)

      if (fetchError) {
        throw new Error('Error al obtener el último día: ' + fetchError.message)
      }

      const nextDayNumber = existingEntries && existingEntries.length > 0 ? existingEntries[0].day_number + 1 : 1

      // Preparar datos para insertar
      const entryData = {
        user_id: session.user.id,
        day_number: nextDayNumber,
        date: new Date().toISOString(),
        intention: intention.trim() || null,
        replacement: replacement.trim() || null,
        ate_junk: ateJunk,
        did_walk: didWalk,
        reflection: reflection.trim() || null,
        took_photo: tookPhoto
      }

      console.log('Inserting data:', entryData)

      // Insertar nueva entrada
      const { data, error: insertError } = await supabase.from('bitacora_entries').insert([entryData]).select()

      console.log('Insert result:', data, insertError)

      if (insertError) {
        throw new Error('Error al crear entrada: ' + insertError.message)
      }

      // Limpiar formulario y mostrar éxito
      setMessage('Entrada creada con éxito.')
      setIntention('')
      setReplacement('')
      setReflection('')
      setAteJunk(false)
      setDidWalk(false)
      setTookPhoto(false)
    } catch (error) {
      console.error('Error:', error)
      setMessage(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  // Si no hay sesión, mostrar mensaje
  if (!session) {
    return (
      <div className='border p-4 rounded'>
        <h2 className='text-lg font-semibold'>Nueva entrada</h2>
        <p className='text-red-600 mt-2'>No hay sesión activa. Por favor, inicia sesión para crear una entrada.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 border p-4 rounded'>
      <h2 className='text-lg font-semibold'>Nueva entrada</h2>

      <textarea
        placeholder='¿Cuál es tu intención hoy?'
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
        className='w-full p-2 border rounded'
        required
        disabled={isLoading}
      />

      <textarea
        placeholder='¿Qué hiciste en lugar de caer en la tentación?'
        value={replacement}
        onChange={(e) => setReplacement(e.target.value)}
        className='w-full p-2 border rounded'
        disabled={isLoading}
      />

      <textarea
        placeholder='Reflexión del día'
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        className='w-full p-2 border rounded'
        disabled={isLoading}
      />

      <div className='flex items-center gap-2'>
        <label>
          <input
            type='checkbox'
            checked={ateJunk}
            onChange={(e) => setAteJunk(e.target.checked)}
            disabled={isLoading}
          />
          ¿Comiste comida chatarra?
        </label>
      </div>

      <div className='flex items-center gap-2'>
        <label>
          <input
            type='checkbox'
            checked={didWalk}
            onChange={(e) => setDidWalk(e.target.checked)}
            disabled={isLoading}
          />
          ¿Saliste a caminar?
        </label>
      </div>

      <div className='flex items-center gap-2'>
        <label>
          <input
            type='checkbox'
            checked={tookPhoto}
            onChange={(e) => setTookPhoto(e.target.checked)}
            disabled={isLoading}
          />
          ¿Tomaste una foto del progreso?
        </label>
      </div>

      <button
        type='submit'
        className='bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400'
        disabled={isLoading}
      >
        {isLoading ? 'Creando...' : 'Crear entrada'}
      </button>

      {message && (
        <p className={`text-sm mt-2 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
      )}
    </form>
  )
}
